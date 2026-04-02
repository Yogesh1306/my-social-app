# 🧵 Thread App — My Social App

A full-stack social media web application built with **Next.js 16**, where users can create threads, join communities, interact with others, and manage their profiles — all with a clean, modern UI.

---

## 🚀 Features

- 🔐 **Authentication** — Powered by [Clerk](https://clerk.dev/) with webhook sync to MongoDB
- 📝 **Threads** — Create, view, and interact with individual threads
- 💬 **Communities** — Create and participate in topic-based communities
- 👤 **User Profiles** — Edit profiles with image uploads via Cloudinary
- 🔔 **Activity Feed** — Track notifications and user interactions
- 🔍 **Search** — Search users and content with pagination support
- 📄 **Pagination** — Applied across search results and community listings
- 📱 **Responsive Design** — Mobile-first UI built with Tailwind CSS + shadcn/ui

---

## 🛠️ Tech Stack

| Category        | Technology                          |
|----------------|--------------------------------------|
| Framework       | [Next.js 16](https://nextjs.org/)   |
| Language        | TypeScript                           |
| Auth            | [Clerk](https://clerk.dev/)          |
| Database        | MongoDB + [Mongoose](https://mongoosejs.com/) |
| ORM/Models      | Mongoose (User, Thread, Community)   |
| File Uploads    | [Cloudinary](https://cloudinary.com/) |
| UI Components   | [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| Styling         | Tailwind CSS                         |
| Icons           | Lucide React                         |
| Form Handling   | React Hook Form + Zod                |
| Animations      | Svix, tw-animate-css                 |

---

## 📁 Project Structure
```text
my-social-app/
├── app/
│   ├── (auth)/                 # Authentication routes (sign in, sign up)
│   ├── (root)/                 # Main protected application routes
│   │   ├── activity/           # Notifications and activity feed
│   │   ├── communities/        # Community discovery and membership
│   │   ├── create-thread/      # Thread creation page
│   │   ├── profile/            # User profile and editing
│   │   ├── search/             # Search users and content
│   │   ├── thread/[id]/        # Single thread details page
│   │   ├── layout.tsx          # Shared layout for protected routes
│   │   └── page.tsx            # Home feed
│   ├── api/webhook/clerk/      # Clerk webhook endpoint
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root application layout
├── components/                 # Reusable UI components
├── constants/                  # Shared application constants
├── lib/
│   ├── actions/                # Server actions for users, threads, and communities
│   ├── models/                 # Mongoose models
│   │   ├── user.model.ts       # User schema
│   │   ├── thread.model.ts     # Thread schema
│   │   └── community.model.ts  # Community schema
│   ├── validations/            # Zod validation schemas
│   ├── mongoose.ts             # MongoDB connection setup
│   ├── uploadToCloudinary.ts   # Cloudinary upload utility
│   └── utils.ts                # Shared helper functions
├── public/                     # Static assets
├── components.json             # shadcn/ui configuration
└── package.json                # Project metadata and dependencies
```
---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)
- Clerk account
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/Yogesh1306/my-social-app.git
cd my-social-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Clerk Webhook
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script        | Description                  |
|--------------|------------------------------|
| `npm run dev`   | Start development server   |
| `npm run build` | Build for production       |
| `npm start`     | Start production server    |
| `npm run lint`  | Run ESLint                 |

---

## 🗄️ Database Models

### User
- Stores Clerk user data (id, name, username, bio, image)
- References threads created and communities joined

### Thread
- Stores thread content, author, parent thread (for replies), and community

### Community
- Stores community name, slug, description, members, and created threads

---

## 🔗 Key Integrations

- **Clerk Webhooks** — Syncs user creation/updates from Clerk to MongoDB automatically via `/api/webhook/clerk`
- **Cloudinary** — Handles profile image uploads with a dedicated server utility
- **Zod Validation** — Form schema validation for threads, user profiles, and community creation

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is open-source. Feel free to use and modify it.

---

## 👤 Author

**Yogesh Joshi** — [@Yogesh1306](https://github.com/Yogesh1306)