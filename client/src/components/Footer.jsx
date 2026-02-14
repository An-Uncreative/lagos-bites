/**
 * Simple footer component displaying copyright information.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer container">
      <div>Lagos Bites © {year}. All rights reserved.</div>
    </footer>
  );
}