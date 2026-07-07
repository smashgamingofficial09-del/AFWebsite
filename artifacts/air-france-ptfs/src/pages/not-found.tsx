export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 pt-20 text-center">
      <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-serif font-medium text-primary mb-6">Destination Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We're sorry, but the page you are looking for does not exist on our flight path. Please check the URL or return to our homepage.
      </p>
      <a 
        href="/"
        className="bg-primary text-white px-8 py-3 font-medium tracking-wide hover:bg-primary/90 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
}
