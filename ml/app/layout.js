import './globals.css';

export const metadata = {
  title: 'Audio Transcription & Translation',
  description: 'Offline audio transcription and translation using AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
