const Navbar = async () => {
  return (
    <main className="flex flex-row items-center justify-between bg-base-300 p-4">
      <section>
        <h2 className="text-2xl font-bold">ImageToText Utility</h2>
      </section>
      <section className="p-2 bg-gray-800 rounded-lg">
        <p>Built with teamwork, not tyranny</p>
      </section>
    </main>
  );
};

export default Navbar;
