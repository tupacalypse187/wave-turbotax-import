# NeuralSec Wave-to-TurboTax Converter (Dockerized)

**Version:** 1.0.0
**Author:** NeuralSec Architect
**DockerHub User:** tupacalypse187

## Overview
This tool provides a secure, self-hosted Web UI to convert Wave Accounting transaction exports (CSV) into the TXF format required by TurboTax Home & Business Desktop.

**Features:**
* **Web Interface:** Drag-and-drop CSV upload.
* **Smart Mapping:** Maps Wave categories to standard TurboTax TXF Tax Lines (Schedule C).
* **Privacy:** Runs entirely offline in a Docker container.

---

## 1. Project Structure
Create a folder named `neuralsec-tax-converter` and create the following two files inside it.

### File 1: `app.py`
This is the application logic.

```python
import streamlit as st
import pandas as pd
from datetime import datetime
import io

# --- CONFIGURATION: MASTER TXF MAPPING ---
# Comprehensive mapping for NeuralSec Advisory (Consulting/Tech)
# Covers Schedule C Parts I (Income) and II (Expenses)

TXF_MAPPING = {
    # --- INCOME (Schedule C Part I) ---
    # Map any potential revenue category you might use in Wave
    "Sales": 266,
    "Service Income": 266,
    "Consulting Income": 266,
    "Revenue": 266,
    "Gross Receipts": 266,
    "Uncategorized Income": 266,

    # --- EXPENSES (Schedule C Part II) ---
    
    # Advertising (Line 8)
    "Advertising & Promotion": 271,
    "Marketing": 271,
    "Web Hosting": 271, # Can be Ad/Promo or Office Exp. 

    # Car & Truck (Line 9)
    # Note: If you use "Standard Mileage Rate", you usually enter miles in TT, 
    # not dollar amounts here. But if you expense actual costs:
    "Vehicle Expenses": 270,
    "Gas & Fuel": 270,
    
    # Commissions & Fees (Line 10)
    "Commissions": 272,
    
    # Contract Labor (Line 11)
    "Contractors": 367, # Specifically for "Cost of Labor" or outside services
    "Subcontractors": 367,

    # Insurance (Line 15)
    "Insurance": 275,
    "Business Insurance": 275,
    "Liability Insurance": 275,

    # Interest (Line 16)
    "Interest Expense": 276,
    "Credit Card Interest": 276,

    # Legal & Professional Services (Line 17)
    "Legal & Professional Services": 277,
    "Legal Fees": 277,
    "Accounting Fees": 277,
    "Consulting Fees": 277,

    # Office Expenses (Line 18) - The Catch-All for Tech
    "Office Expenses": 278,
    "Office Supplies": 278,
    "Postage": 278,
    "Shipping": 278,
    "Software": 278,
    "Computer - Hardware": 278,  # De Minimis Safe Harbor (<$2,500)
    "Computer - Hosting": 278,   # Can also be 271, but 278 is safe
    "Computer - Software": 278,
    "Small Tools & Equipment": 278,

    # Rent/Lease (Line 20)
    "Rent": 281,
    "Equipment Rental": 280,

    # Repairs (Line 21)
    "Repairs & Maintenance": 282,

    # Taxes & Licenses (Line 23)
    "Taxes & Licenses": 286,
    "State Taxes": 286,
    "Permits": 286,

    # Travel & Meals (Line 24)
    "Travel": 283,
    "Airfare": 283,
    "Hotel": 283,
    "Taxi & Rideshare": 283,
    "Meals": 284,               # 50% Limit (TT calculates this)
    "Meals & Entertainment": 284,
    "Client Meals": 284,

    # Utilities (Line 25)
    "Utilities": 287,
    "Telephone": 287,
    "Mobile Phone": 287,
    "Internet": 287,
    "Computer - Internet": 287,
    "Telephone Wireless": 287,

    # Other Expenses (Line 27a / Part V)
    "Dues & Subscriptions": 298,
    "Education & Training": 298,
    "Conferences": 298,
    "Bank Service Charges": 298,
    "Merchant Fees": 298,       # Stripe/PayPal fees
    "Uniforms": 298,
    "Gifts": 298,
}

def convert_to_txf(df):
    output = []
    
    # TXF Header
    output.append("V041") 
    output.append("A" + "NeuralSec Advisory") 
    output.append("D" + datetime.now().strftime("%m/%d/%Y"))
    output.append("^")

    # Process Rows
    for index, row in df.iterrows():
        try:
            # Clean amount string to float
            raw_amount = str(row['Amount']).replace(',', '').replace('$', '')
            amount = float(raw_amount)
            
            category = row.get('Category', 'Uncategorized')
            description = row.get('Description', 'No Description')
            
            # Robust Date Parsing
            try:
                date_obj = pd.to_datetime(row['Date'])
                date_str = date_obj.strftime("%m/%d/%Y")
            except:
                date_str = datetime.now().strftime("%m/%d/%Y")

            # Determine TXF Code
            txf_code = TXF_MAPPING.get(category)
            
            if txf_code:
                output.append("^")
                output.append(f"C{txf_code}") # Tax Line Code
                output.append(f"P{description}") # Description
                output.append(f"D{date_str}") # Date
                
                # Logic: Wave Expenses are negative (-), Income is positive (+).
                # TXF requires positive numbers for Expenses.
                output.append(f"${abs(amount):.2f}") 
                
                output.append("^")
                
        except Exception as e:
            continue

    return "\n".join(output)

# --- WEB INTERFACE ---
st.set_page_config(page_title="NeuralSec Tax Converter", page_icon="💰")

st.title("NeuralSec Wave -> TurboTax Converter")
st.markdown("### Master Config (All Categories)")
st.caption("Supports: Income, Office, Legal, Travel, Tech, and more.")

uploaded_file = st.file_uploader("Upload Wave Transactions (CSV)", type="csv")

if uploaded_file is not None:
    try:
        df = pd.read_csv(uploaded_file)
        st.write("### Data Preview")
        st.dataframe(df.head())

        if st.button("Convert to TXF"):
            txf_data = convert_to_txf(df)
            st.success("Conversion Complete!")
            
            st.download_button(
                label="⬇️ Download .TXF File",
                data=txf_data,
                file_name="neuralsec_tax_import.txf",
                mime="application/text"
            )
            
    except Exception as e:
        st.error(f"Error: {e}")
```

### File 2: `Dockerfile`

```dockerfile
# Base Image: Official Python Slim (Debian based) - Small & Secure
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
# pandas: for CSV processing
# streamlit: for the Web UI
RUN pip install --no-cache-dir pandas streamlit

# Copy the application code
COPY app.py .

# Expose Streamlit default port
EXPOSE 8501

# Healthcheck to ensure container is running
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health || exit 1

# Run the application
ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

---

## 2. Build & Run (Local Development)

You can run this immediately on your Windows 11, Ubuntu, or Mac machine assuming Docker Desktop/Engine is installed.

### Step 1: Build the Image
Open your terminal in the `neuralsec-tax-converter` folder.

```bash
docker build -t neuralsec-tax-converter .
```

### Step 2: Run the Container
```bash
docker run -p 8501:8501 neuralsec-tax-converter
```

### Step 3: Access the Interface
Open your browser and navigate to:
**http://localhost:8501**

1.  Upload your Wave CSV.
2.  Click "Convert to TXF".
3.  Download the file.
4.  **Import to TurboTax:** File > Import > From Accounting Software > Other Financial Software (TXF).

---

## 3. DockerHub Deployment (CI/CD)

To keep this image updated and available on any of your machines (Server, Laptop, Desktop), push it to your `tupacalypse187` DockerHub account.

### Step 1: Login
```bash
docker login
# Enter username: tupacalypse187
# Enter password/token
```

### Step 2: Tag the Image
We tag it with a version number and 'latest'.

```bash
docker tag neuralsec-tax-converter tupacalypse187/neuralsec-tax-converter:v1.0
docker tag neuralsec-tax-converter tupacalypse187/neuralsec-tax-converter:latest
```

### Step 3: Push to Hub
```bash
docker push tupacalypse187/neuralsec-tax-converter:v1.0
docker push tupacalypse187/neuralsec-tax-converter:latest
```

### Step 4: Pulling on Another Machine (e.g., Ubuntu Server)
On your Ubuntu 24.04 server, you can now simply run:

```bash
docker run -d -p 8501:8501 --name tax-converter tupacalypse187/neuralsec-tax-converter:latest
```

---

## 4. Maintenance & Updates

When you need to update the python script (e.g., to add new Tax Categories to the `TXF_MAPPING` dictionary in `app.py`):

1.  Edit `app.py`.
2.  Rebuild: `docker build -t neuralsec-tax-converter .`
3.  Retag: `docker tag neuralsec-tax-converter tupacalypse187/neuralsec-tax-converter:v1.1` (increment version).
4.  Push: `docker push tupacalypse187/neuralsec-tax-converter:v1.1`
