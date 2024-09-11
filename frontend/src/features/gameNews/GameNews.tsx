import CustomPaginationBlocks from "@/components/pagination/CustomPaginationBlocks";
import { usePagination } from "@/hooks/usePagination";
import { GameNewsModel, SteamGames } from "@/lib/db_interface";
import { GetAllNewsByGameIdData } from "@/services/gameServices";
import { useEffect } from "react";

interface GameNewsProps {
  gameNews: GameNewsModel[];
  selectedGame: SteamGames | undefined;
}
const GameNews = ({ gameNews, selectedGame }: GameNewsProps) => {
  const {
    currentPage,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    startIndex,
    totalPages,
  } = usePagination({
    itemsPerPage: 10,
    totalItems: gameNews.length,
  });
  useEffect(() => {
    goToPage(1);
  }, [selectedGame]);
  return (
    <>
      <h1 className="text-primary text-4xl font-bold text-center">
        {selectedGame?.name} News
      </h1>
      <div>
        <CustomPaginationBlocks
          currentPage={currentPage}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          totalPages={totalPages}
        />
        <div className="flex flex-row justify-between">
          <p className="font-bold text-sm">{gameNews.length} Articles</p>
          <p className="font-bold text-sm">
            Page {currentPage}/{Math.max(totalPages, 1)}
          </p>
        </div>
      </div>
      {gameNews.length > 0 ? (
        gameNews
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(startIndex, endIndex + 1)
          .map((article) => (
            <div
              key={article.id}
              className="bg-slate-700 rounded-lg p-3 flex flex-col-reverse lg:flex-row gap-3"
            >
              <div className="flex flex-col gap-3 w-full lg:w-7/12">
                <div className="text-center lg:text-start">
                  <a
                    className="text-xl font-bold text-primary hover:brightness-125"
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                  <p className="font-bold">
                    {new Date(article.date).toLocaleDateString()} By:{" "}
                    {article.author}
                  </p>
                </div>
                <div>
                  <p className="text-lg">Article Summary:</p>
                  <p>{article.summary}</p>
                </div>
              </div>
              <div className="flex flex-row w-full lg:w-5/12">
                <a
                  className="w-full max-w-fit ml-auto mr-auto lg:mr-0"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={article.link}
                >
                  <img src={article.thumbnailLink} />
                </a>
              </div>
            </div>
          ))
      ) : (
        <>
          <p className="text-center text-xl">No News</p>
        </>
      )}
    </>
  );
};

export default GameNews;
