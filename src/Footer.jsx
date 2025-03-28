function Footer() {
  return (
    <footer class="bg-gray-800 text-white py-6 mt-10">
  <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
    <div class="flex flex-col items-center md:items-start mb-4 md:mb-0">
      <h2 class="text-lg font-bold">The PDF Summariser</h2>
      <p class="text-sm">&copy; 2025 <a href="https://github.com/NEERASA-VEDA-VARSHIT" class="text-blue-400 hover:underline">NEERASA-VEDA-VARSHIT</a>. All rights reserved.</p>
    </div>
    <div class="flex space-x-4">
      <a href="https://github.com/NEERASA-VEDA-VARSHIT" class="text-blue-400 hover:underline">GitHub Repo</a>
      <a href="https://x.com/VedaVarshit_N" class="text-blue-400 hover:underline">Twitter</a>
      <a href="www.linkedin.com/in/vedavarshit" class="text-blue-400 hover:underline">LinkedIn</a>
    </div>
  </div>
  <div class="text-center mt-4">
    <p>Built with ❤️ using React and Tailwind CSS.</p>
  </div>
</footer>
  );
}
export default Footer;
