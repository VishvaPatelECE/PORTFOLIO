import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="wrap not-found">
      <span className="mono gold">404 / PATH NOT FOUND</span>
      <h1>
        No system
        <br />
        at this address.
      </h1>
      <p>
        The engineering work is still here. Return to the index to continue.
      </p>
      <Link className="button" href="/">
        RETURN HOME ↗
      </Link>
    </main>
  );
}
