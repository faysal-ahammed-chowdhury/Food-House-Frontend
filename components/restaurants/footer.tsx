export default function Footer() {
  return (
    <footer className="py-5 border-t border-gray-100 text-sm text-gray-500 bg-white">
        <p className="text-center">
          © {new Date().getFullYear()} Food House. All rights reserved.
        </p>
    </footer>
  );
}
