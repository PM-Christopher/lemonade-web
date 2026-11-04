# Deploying the user app and the admin app

This is a step-by-step guide for the two websites in this repository:

- the **user app** (`apps/frontend`, package name `lemonade-app`), where people use Lemonade;
- the **admin app** (`apps/admin`, package name `lemonade-admin`), where your team runs it.

Both are Next.js apps. They talk to the backend (`lemonade-backend`), which has its own guide in
[`DEPLOYMENT.md`](./DEPLOYMENT.md). You will deploy three things in total: the backend, the user app and
the admin app.

**Does Heroku host Next.js?** Yes. Heroku runs any Node app, and Next.js is one. The repository is already
set up for it. The only catch is the order of work, explained next.

## The order that avoids the "chicken and egg" problem

The backend needs to know the addresses of the two apps (`FRONTEND_URL` and `ADMIN_URL`). The two apps need
to know the address of the backend (`LARAVEL_API_URL`). Each one needs the others, so it looks like you
cannot start.

You can, because **an address exists before the app is deployed**. On Heroku, the moment you create an app
it gets its address. On your own domain, you choose the address first and connect it later. So:

1. **Create all three apps first** (or choose all three domain names). Write the three addresses down.
2. **Set the values** on all three, using those addresses.
3. **Deploy** the backend, then the user app, then the admin app.

Nothing has to be live to set a value. If you ever need to change an address later, you can: set the new
value on the backend and it restarts by itself. The two apps need a new build, which is one more push.

## What you need

- The code for this repository in your own Git repository (GitHub is fine).
- A Heroku account with a card added (Heroku does not run apps for free), or a DigitalOcean or AWS account.
- The backend address, or the plan for it. Do the backend with [`DEPLOYMENT.md`](./DEPLOYMENT.md).
- About 45 minutes for the first time.

## The values each app needs

A **value** (also called an environment variable) is a setting you give the host. The names that start with
`NEXT_PUBLIC_` are written into the website while it is **built**. That means you must set them before the
build, and if you change one later you must build again.

### User app

| Name | What to put | Required |
| ---- | ----------- | -------- |
| `LARAVEL_API_URL` | The backend address, for example `https://api.example.com`. No slash at the end. | Yes |
| `NEXT_PUBLIC_BASE_URL` | The same backend address. | Yes |
| `NEXT_PUBLIC_APP_URL` | The user app's own address, for example `https://app.example.com`. Payments and sign-in send people back to it. | Yes |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google sign-in client ID. | No |
| `NEXT_PUBLIC_FIREBASE_*` (8 values) | From your Firebase project, for push notifications. | No |
| `NEXT_PUBLIC_REVERB_KEY`, `_HOST`, `_PORT`, `_SCHEME` | For live chat. Must match the backend's Reverb settings. | No |

### Admin app

| Name | What to put | Required |
| ---- | ----------- | -------- |
| `LARAVEL_API_URL` | The backend address. | Yes |
| `NEXT_PUBLIC_BASE_URL` | The same backend address. | Yes |
| `NEXT_PUBLIC_USER_APP_URL` | The user app's address, so links from the admin open the right site. | Recommended |
| `NEXT_PUBLIC_FIREBASE_*` | Same Firebase project as the user app. | No |
| `NEXT_PUBLIC_REVERB_*` | Same as the user app. | No |

Leave `NEXT_PUBLIC_USERNAME` and `NEXT_PUBLIC_PASSWORD` out completely. They only prefill the login form on a
developer's computer.

If a required value is missing or is not a full address (it must start with `http://` or `https://`), the
build stops with the message `Invalid url` and the name of the value. That is the quickest way to find a
typo.

---

# Option 1. Heroku

Heroku builds the app from your repository and runs it. The repository has a `Procfile` and build scripts
for this, so you do not need to add anything.

How it works: you make **one Heroku app per website** from the same code. A value called `APP_NAME` tells
Heroku which website that app is: `lemonade-app` for the user app, `lemonade-admin` for the admin app.

## Step 1. Install and log in

Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli), then:

```bash
heroku login
```

## Step 2. Create all three apps and write down their addresses

Open a terminal in the `lemonade-web` folder. Heroku app names are shared by everyone, so add something
of your own to the names below, for example `acme-`.

```bash
heroku create acme-lemonade-app --remote heroku-app --buildpack heroku/nodejs
heroku create acme-lemonade-admin --remote heroku-admin --buildpack heroku/nodejs
```

The `--remote` part gives each app its own name in Git, so you can send the code to the right one later.
(If you made the backend with the guide in `DEPLOYMENT.md`, it is already created, for example
`acme-lemonade-api`.)

Now read each app's address:

```bash
heroku apps:info -a acme-lemonade-app
heroku apps:info -a acme-lemonade-admin
heroku apps:info -a acme-lemonade-api
```

Look for the line `Web URL`. It looks like `https://acme-lemonade-app-1a2b3c4d5e6f.herokuapp.com/`. Heroku adds
the letters and numbers, so copy the real one. Write down all three. Drop the slash at the end when you
use them.

**Using your own domain instead?** Choose the three names now (for example `app.example.com`,
`admin.example.com` and `api.example.com`) and use those in the next steps. You connect them to Heroku in
step 8. Deciding now saves a rebuild later.

## Step 3. Tell the backend where the two apps are

This is the step that looked impossible. It is not, because you already have the addresses:

```bash
heroku config:set FRONTEND_URL=https://YOUR-USER-APP-ADDRESS ADMIN_URL=https://YOUR-ADMIN-APP-ADDRESS -a acme-lemonade-api
```

It is safe to do before the two apps are live. If the backend is already running, it restarts for a few
seconds.

## Step 4. Set the values for the user app

```bash
heroku config:set -a acme-lemonade-app \
  APP_NAME=lemonade-app \
  LARAVEL_API_URL=https://YOUR-BACKEND-ADDRESS \
  NEXT_PUBLIC_BASE_URL=https://YOUR-BACKEND-ADDRESS \
  NEXT_PUBLIC_APP_URL=https://YOUR-USER-APP-ADDRESS
```

Add the optional values (Google, Firebase, Reverb) in the same way if you use them. Do it now, before the
first push.

## Step 5. Send the user app up

```bash
git push heroku-app main
```

Heroku installs everything, builds the app (this takes about five minutes), and starts it. Watch it in the
terminal. When it ends with `Verifying deploy... done`, it is live.

If your Git branch is not called `main`, use `git push heroku-app YOUR-BRANCH:main`.

## Step 6. Set the values for the admin app and send it up

```bash
heroku config:set -a acme-lemonade-admin \
  APP_NAME=lemonade-admin \
  LARAVEL_API_URL=https://YOUR-BACKEND-ADDRESS \
  NEXT_PUBLIC_BASE_URL=https://YOUR-BACKEND-ADDRESS \
  NEXT_PUBLIC_USER_APP_URL=https://YOUR-USER-APP-ADDRESS

git push heroku-admin main
```

## Step 7. Check that they work

1. Open the user app address. You should see the Lemonade sign-in page.
2. Open the admin app address and sign in with the admin you created in the backend guide
   (`SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`). Change the password after.
3. In the user app, create an account. If the page says it cannot reach the server, see
   [Problems and fixes](#problems-and-fixes).

To see what an app is doing, use `heroku logs --tail -a acme-lemonade-app`.

## Step 8. Use your own domain (optional)

For each app:

```bash
heroku domains:add app.example.com -a acme-lemonade-app
```

Heroku prints a value called the DNS target. At the company where you bought the domain, add a **CNAME**
record: name `app`, value the DNS target. Heroku adds the security certificate (https) by itself on paid
dynos.

If you started with the `herokuapp.com` addresses and then switch to your own domain, three things must
change, in this order:

1. On the backend, set `FRONTEND_URL` and `ADMIN_URL` to the new addresses.
2. On each app, set `NEXT_PUBLIC_APP_URL` (user app) or `NEXT_PUBLIC_USER_APP_URL` (admin app) to the new
   address, and set `LARAVEL_API_URL` and `NEXT_PUBLIC_BASE_URL` too if the backend address changed.
3. **Build each app again**, because these values are fixed at build time:

   ```bash
   git commit --allow-empty -m "chore: rebuild with the new addresses"
   git push heroku-app main
   git push heroku-admin main
   ```

## Step 9. Updating later

Push the new code to each app: `git push heroku-app main` and `git push heroku-admin main`. If the change
also touches the backend, deploy the backend first.

## Good to know about Heroku

- **Sleeping:** the cheapest Heroku plan (Eco) puts an app to sleep when nobody uses it, so the first visit
  after a quiet period is slow. For a real site use the Basic plan or higher, which stays awake.
- **Size limit:** Heroku limits how big an app can be (about 500 MB). This repository holds both apps and
  several shared packages, so if the build ends with a message that the slug is too large, use Option 2 or
  Option 3 for the two websites instead.
- **Cost:** each Heroku app is billed on its own, so the backend, the user app and the admin app are three
  separate charges.

---

# Option 2. DigitalOcean App Platform

App Platform builds from your Git repository, like Heroku. Make **two separate apps**, one for each
website. (Do not put both in one App Platform app. An app has one address, and each website needs its own.)

Do these steps once for the user app, then again for the admin app.

1. In DigitalOcean choose **Create, then Apps**.
2. Choose **GitHub** (or GitLab), pick your `lemonade-web` repository and the `main` branch. Leave the
   source directory as `/`. Tick **Autodeploy** if you want every push to deploy.
3. DigitalOcean shows what it found. Click **Edit** on the Node component and set:

   | Setting | User app | Admin app |
   | ------- | -------- | --------- |
   | Type | Web Service | Web Service |
   | Build command | `pnpm install --frozen-lockfile && pnpm build:frontend` | `pnpm install --frozen-lockfile && pnpm build:admin` |
   | Run command | `pnpm start:frontend` | `pnpm start:admin` |
   | HTTP port | `8080` | `8080` |
   | Plan | Basic, 1 GB or more | Basic, 1 GB or more |

4. Under **Environment variables** add the values from the tables above. For each one choose **Build and
   run time**, not just run time, so the build can read them.
5. Give the app a name, pick a region near your backend, and click **Create app**. The first build takes
   about five minutes.
6. When it finishes, DigitalOcean shows the app's address (it ends in `.ondigitalocean.app`). To use your
   own domain, open **Settings, Domains, Add domain** and add the record it shows.
7. Go back to the backend and set `FRONTEND_URL` and `ADMIN_URL` to the two addresses.

The same trick as on Heroku works here. Create both apps first, read their addresses, put them into the
values, and only then deploy. If you deployed before you knew an address, set the value and click
**Deploy** again so the app builds with the right one.

---

# Option 3. A server on AWS (Lightsail)

You rent one small server and run both websites on it. It is more work than the first two options, and it
gives you the most control.

## Step 1. Create the server

1. In the AWS console open **Lightsail**, then **Create instance**.
2. Choose Linux, **OS Only**, **Ubuntu 24.04**, and a plan with 2 GB of memory or more.
3. Create a **static IP** and attach it to the instance. In the instance's **Networking** tab open ports
   **80** and **443**.
4. Point your two domain names (`app.example.com` and `admin.example.com`) at that IP with an **A record**
   at your domain company.

## Step 2. Install the tools

Use **Connect using SSH** in the console, then:

```bash
sudo apt update && sudo apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm pm2
```

## Step 3. Get the code and set the values

```bash
git clone YOUR_WEB_REPOSITORY_URL lemonade-web
cd lemonade-web
```

Make one file of values for each app:

```bash
nano apps/frontend/.env.production
nano apps/admin/.env.production
```

Put one value per line, like `LARAVEL_API_URL=https://api.example.com`, using the tables near the top of
this guide. Save with Ctrl+O, then leave with Ctrl+X.

## Step 4. Build and start

```bash
pnpm install --frozen-lockfile
pnpm build:frontend
pnpm build:admin
PORT=3000 pm2 start "pnpm start:frontend" --name lemonade-app
PORT=3001 pm2 start "pnpm start:admin" --name lemonade-admin
pm2 save
pm2 startup
```

`pm2` keeps both running and starts them again after a restart. `pm2 startup` prints one more command.
Copy it and run it.

## Step 5. Put your domains in front of them

Create `/etc/nginx/sites-available/lemonade-apps`:

```nginx
server {
    listen 80;
    server_name app.example.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name admin.example.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/lemonade-apps /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.example.com -d admin.example.com
```

## Step 6. Updating later

```bash
cd lemonade-web && git pull
pnpm install --frozen-lockfile
pnpm build:frontend && pnpm build:admin
pm2 restart lemonade-app lemonade-admin
```

If you prefer not to run a server, **AWS Amplify Hosting** can build Next.js from your repository. Give it
the same build commands and values, and set the app root to `apps/frontend` or `apps/admin`.

---

# Try a production build on your own computer first (optional)

This catches a missing value before you deploy. **Stop your local dev servers first**, because the build
replaces the files they use.

```bash
export LARAVEL_API_URL=https://YOUR-BACKEND-ADDRESS
export NEXT_PUBLIC_BASE_URL=https://YOUR-BACKEND-ADDRESS
export NEXT_PUBLIC_APP_URL=https://YOUR-USER-APP-ADDRESS
pnpm build:frontend
```

If it finishes without `Invalid url`, the values are fine. Do the same for `pnpm build:admin` with its own
values.

---

# After the first deploy

1. **Payments:** pay once with a Paystack test card in the user app. After paying you should land back on
   the user app. If you land on a different address, `NEXT_PUBLIC_APP_URL` is wrong (build again after
   fixing it).
2. **Google sign-in:** in the Google Cloud console, add the user app's address to the client's
   **Authorized JavaScript origins**.
3. **Push notifications:** in the Firebase console, add both app addresses under **Authentication,
   Settings, Authorized domains**.
4. **Pictures:** upload a picture in the user app. It should show. Uploads must go to Cloudinary (set up
   in the backend guide), because the apps only show pictures from Cloudinary or DigitalOcean Spaces.

# Problems and fixes

| What you see | What to do |
| ------------ | ---------- |
| The build stops with `Invalid url` and a name | That value is missing or does not start with `https://`. Set it and push again. |
| The page says it cannot reach the server | `LARAVEL_API_URL` is wrong, has a slash at the end, or uses `http` where the backend uses `https`. Fix it, then restart the app. |
| You are signed out again on every page | The apps and the backend must all use `https`. Check that the backend's `FRONTEND_URL` and `ADMIN_URL` match the real addresses. |
| A changed `NEXT_PUBLIC_` value has no effect | Those are fixed when the app is built. Build and deploy again. |
| After paying, you land on the wrong site | `NEXT_PUBLIC_APP_URL` on the user app is wrong. Fix it and build again. |
| Pictures are missing | They are not on Cloudinary. Check the backend's Cloudinary values and upload the picture again. |
| Heroku says the compiled slug size is too large (max is 500M) | Use Option 2 or Option 3 for the websites. |
| Chat does not connect, and the browser shows a CORS message | Add the user app's address to `allowed_origins` in the backend's `config/cors.php`, then deploy the backend. |
| Heroku says `No web processes running` | The `APP_NAME` value is missing. Set it to `lemonade-app` or `lemonade-admin` and restart. |
| The wrong website appears at an address | You pushed to the wrong app. Use `git push heroku-app main` for the user app and `git push heroku-admin main` for the admin app. |

When you are stuck, the fastest help is the exact message from `heroku logs --tail -a YOUR-APP` (or the
build log on DigitalOcean) and the step you were on.
