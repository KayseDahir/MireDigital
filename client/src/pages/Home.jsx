import BestSeller from "../components/BestSeller";
import Categories from "../components/Categories";
import MainBanner from "../components/MainBanner";
import NewsLetter from "../components/NewsLetter";

function Home() {
  return (
    <div>
      <MainBanner />
      <Categories />
      <BestSeller />
      <NewsLetter />
    </div>
  );
}

export default Home;
