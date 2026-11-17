import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        The page you are looking for does not exist or has not been built yet.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Back to Home
      </Link>
    </section>
  )
}