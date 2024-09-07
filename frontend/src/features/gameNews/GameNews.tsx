import { SteamGames } from "@/lib/db_interface";
import { GetAllNewsByGameIdData } from "@/services/gameServices";

interface GameNewsProps {
  gameNews: GetAllNewsByGameIdData | undefined;
  selectedGame: SteamGames | undefined;
}
const GameNews = ({ gameNews, selectedGame }: GameNewsProps) => {
  return (
    <>
      <h1 className="text-primary text-4xl font-bold text-center">
        {selectedGame?.name} News
      </h1>
      {gameNews && gameNews?.articles?.length > 0 ? (
        gameNews?.articles
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((article) => (
            <div className="bg-slate-700 rounded-lg p-3 flex flex-row gap-3">
              <div className="flex flex-col gap-3 w-7/12">
                <div>
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
              <div className="flex flex-row text-end w-5/12">
                <a
                  className="w-full max-w-fit ml-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={article.link}
                >
                  <img className="ml-auto" src={article.thumbnailLink} />
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
