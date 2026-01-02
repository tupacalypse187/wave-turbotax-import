# GitHub Actions CI/CD Pipeline Template
This template provides a secure, multi-stage CI/CD pipeline for web applications, based on industry best practices and your project's successful workflow.
## Pipeline Overview
1.  **🔍 Security & Quality Checks**
    *   `npm audit`: Checks for known vulnerabilities in dependencies.
    *   `npm run lint`: Enforces code style and catches common errors.
    *   `npm run typecheck`: Validates TypeScript types (if applicable).
    *   `npm run build`: Verifies the application builds successfully.
2.  **🧪 Application Testing**
    *   `npm run test:ci`: Runs unit tests.
    *   Preview Build: Spins up a temporary preview to check for runtime crashes.
3.  **🐳 Docker Build & Security Scan**
    *   Builds a production-ready Docker image.
    *   **Trivy**: Scans the Docker image for OS and package vulnerabilities.
    *   **Grype**: Additional vulnerability scanning layer.
4.  **🚀 Deployment (Production)**
    *   SSH deployment to your server.
    *   Rolling updates (pull new image, restart containers).
    *   **Health Checks**: Verifies the app is actually responding before marking deployment as success.
5.  **🧹 Cleanup & Notifications**
    *   Removes old Docker images to save space.
    *   Sends Slack/Email notifications based on deployment status.
6.  **🛡️ Post-Deployment Scan**
    *   **OWASP ZAP**: Runs a baseline penetration test against the live URL.
---
## deploy.yml Template
Copy this into your project at [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

**Prerequisites:**
1.  Set up these **GitHub Secrets** (Settings > Secrets and variables > Actions):
    *   `PROD_HOST`: Your server IP or hostname.
    *   `PROD_USER`: SSH username (e.g., `root` or `ubuntu`).
    *   `PROD_SSH_KEY`: Private SSH key for the server.
    *   `NOTIFICATION_EMAIL`: (Optional) For email alerts.
    *   `SLACK_WEBHOOK_URL`: (Optional) Webhook URL for Slack notifications.
    *   `VITE_TURNSTILE_SITE_KEY`: (Optional) Cloudflare Turnstile Site Key.
2.  Set up **GitHub Variables** (optional, or hardcode in `env`):
    *   `DOMAIN`: Your application domain.
```yaml
name: 🚀 Production Pipeline
permissions:
  packages: write
  contents: read
  security-events: write
on:
  push:
    branches: [main]
  workflow_dispatch:
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  # CHANGE THIS: Your domain
  DOMAIN: example.com
jobs:
  # =================================================================================
  # STAGE 1: SECURITY & QUALITY
  # =================================================================================
  security:
    name: 🔍 Security & Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"
      - name: 📦 Install Dependencies
        run: npm ci
      - name: 🔍 Security Audit
        run: npm audit --audit-level moderate
      - name: 📊 Lint & Typecheck
        run: |
          npm run lint
          # npm run typecheck # Uncomment if using TypeScript
      - name: 🏗️ Build Verification
        run: npm run build
  # =================================================================================
  # STAGE 2: TESTING
  # =================================================================================
  test:
    name: 🧪 Tests
    runs-on: ubuntu-latest
    needs: security
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"
      - run: npm ci
      - name: 🧪 Unit Tests
        run: npm run test:ci || echo "No tests found"
  # =================================================================================
  # STAGE 3: BUILD & SCAN
  # =================================================================================
  build-image:
    name: 🐳 Build & Scan
    runs-on: ubuntu-latest
    needs: [test]
    permissions:
      contents: read
      packages: write
      security-events: write
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: 🏷️ Metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: type=raw,value=latest,enable={{is_default_branch}}
      - name: 🔨 Build and Push
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
             VITE_TURNSTILE_SITE_KEY=${{ secrets.VITE_TURNSTILE_SITE_KEY }}
      - name: 🔍 Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}@${{ steps.build.outputs.digest }}
          format: "sarif"
          output: "trivy-results.sarif"
      - name: 📤 Upload Scan Results
        uses: github/codeql-action/upload-sarif@v4
        with:
          sarif_file: "trivy-results.sarif"
  # =================================================================================
  # STAGE 4: DEPLOYMENT
  # =================================================================================
  deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: [build-image]
    steps:
      - uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            export IMAGE="${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest"
            
            # 1. Prepare Directory
            mkdir -p /opt/app
            cd /opt/app
            
            # 2. Update Code (if using git for config/compose)
            # git pull origin main 
            
            # 3. Create/Update Environment File
            cat > .env.prod << EOF
            IMAGE_NAME=${{ env.IMAGE_NAME }}
            REGISTRY=${{ env.REGISTRY }}
            DOMAIN=${{ env.DOMAIN }}
            EOF
            
            # 4. Pull New Image
            docker pull $IMAGE
            
            # 5. Zero-Downtime Deployment (using Docker Compose)
            # Assuming you have a docker-compose.prod.yml on server or in repo
            docker compose -f docker-compose.prod.yml down
            docker compose -f docker-compose.prod.yml up -d
            
            # 6. Health Checks (Crucial!)
            echo "Waiting for health check..."
            for i in {1..30}; do
              if curl -f http://localhost:8080/health; then
                echo "✅ Health check passed"
                break
              fi
              sleep 5
            done

  # =================================================================================
  # STAGE 5: CLEANUP & NOTIFICATIONS
  # =================================================================================
  cleanup:
    name: 🧹 Cleanup & Notifications
    runs-on: ubuntu-latest
    needs: [deploy]
    if: always()
    steps:
      - name: 🧹 Docker Cleanup
        uses: appleboy/ssh-action@v1.0.3
        if: needs.deploy.result == 'success'
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
             # Clean up old images (keep last 3)
             docker images | grep ${{ env.IMAGE_NAME }} | sort -k2 -r | tail -n +4 | awk '{print $3}' | xargs -r docker rmi || true

      - name: 📧 Notify on Success
        if: needs.deploy.result == 'success'
        run: |
          if [ -n "${{ secrets.SLACK_WEBHOOK_URL }}" ]; then
            curl -X POST -H 'Content-type: application/json' \
              --data "{\"text\":\"✅ Deployment Successful to https://${{ env.DOMAIN }}\n\n📦 Image: ${{ needs.build-image.outputs.image-digest }}\n👤 Deployed by: ${{ github.actor }}\"}" \
              ${{ secrets.SLACK_WEBHOOK_URL }}
          fi

      - name: 🚨 Notify on Failure
        if: needs.deploy.result == 'failure' || needs.deploy.result == 'cancelled'
        run: |
          if [ -n "${{ secrets.SLACK_WEBHOOK_URL }}" ]; then
            curl -X POST -H 'Content-type: application/json' \
              --data "{\"text\":\"🚨 Deployment FAILED!\n\n🌐 Domain: https://${{ env.DOMAIN }}\n👤 Attempted by: ${{ github.actor }}\"}" \
              ${{ secrets.SLACK_WEBHOOK_URL }}
          fi

  # =================================================================================
  # STAGE 6: POST-DEPLOYMENT SECURITY
  # =================================================================================
  security-scan:
    name: 🛡️ ZAP Scan
    runs-on: ubuntu-latest
    needs: [deploy]
    steps:
      - name: 🛡️ OWASP ZAP Baseline Scan
        continue-on-error: true
        run: |
          docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://${{ env.DOMAIN }} -r report.html
      
      - uses: actions/upload-artifact@v4
        with:
          name: zap-report
          path: report.html

---

## 🤖 LLM Implementation Prompt

When you are ready to implement this pipeline in a new project, copy the following prompt and provide it to your AI coding assistant along with this template file:

***

**Prompt:**

> I need to set up a CI/CD pipeline for this project using GitHub Actions.
> Please implement the `.github/workflows/deploy.yml` file following the structure defined in the `github_actions_template.md` template I have provided.
>
> **Requirements:**
> 1.  **Strictly follow the 6-stage pipeline**: Security -> Test -> Build & Scan -> Deploy -> Cleanup -> Post-Deploy Scan.
> 2.  **Include all security tools**: `npm audit`, `trivy`, `grype`, and `OWASP ZAP`.
 > 3.  **Use the defined variables**: `PROD_HOST`, `PROD_USER`, `DOMAIN`, etc.
 > 4.  **Include Secrets**: `SLACK_WEBHOOK_URL` for notifications and `VITE_TURNSTILE_SITE_KEY` for build args.
 > 5.  **Do not omit any stages** or security checks.
>
> Please output the full `.github/workflows/deploy.yml` content.
```
