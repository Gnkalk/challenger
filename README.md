# Challenger 🚀

A personal project for building and tracking daily habits, tailored for my own usage.

## ✨ What's it all about?

This is my personal challenge tracker. It's a space where I create, join, and monitor my daily challenges to build better habits and achieve my goals. It's built by me, for me!

**Key Features:**

*   **🎯 Create & Join Challenges:** Start your own challenge or join existing ones to push your limits.
*   **📅 Visual Calendars:** Track your progress and see who else is participating with our interactive calendar views.
*   **👥 Community Driven:** Connect with like-minded individuals, share your journey, and cheer each other on.
*   **📝 Plan & Detail:** Lay out your daily plans and challenge details using our built-in Markdown editor.
*   **🌐 Multi-Calender Support:** Enjoy the platform in English or Persian Calendar.
*   **🎨 Modern UI:** Built with Next.js, Tailwind CSS, and shadcn/ui for a smooth and beautiful experience.

## 🚀 Getting Started

Let's get you up and running!

**Prerequisites:**

*   Node.js (v18 or later)
*   pnpm (or your favorite package manager)

**Installation:**

1.  Clone the repo:
    ```bash
    git clone https://github.com/Gnkalk/challenger.git
    cd challenger
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up your environment variables (create a `.env.local` file based on `.env.example` if you have one).
4.  Run the development server:
    ```bash
    pnpm dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) and start your first challenge!

## 🛠️ Tech Stack

We're using some awesome tools to build Challenger 2:

*   **Frontend:** Next.js 15, React 19, TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui components
*   **Authentication:** NextAuth.js
*   **Database:** Drizzle ORM (with PostgreSQL support)
*   **UI Components:** Radix UI, Base UI Components
*   **Markdown:** @uiw/react-md-editor
*   **Calendar:** react-day-picker
*   **Deployment:** Optimized for Cloudflare with OpenNext.js

## 📝 Project Structure

Here's a quick look at how the project is organized:

```
src/
├── app/                 # Next.js app router pages and API routes
├── components/          # React components (UI, challenges, auth)
├── lib/                # Utility functions and configurations
└── server/             # Server-side actions, auth, and database queries
```

## 🤝 Contributing

This is a personal project, but I'm open to feedback and suggestions! If you have ideas for improvements or spot any bugs, feel free to open an issue.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Challenging!** 🎉
