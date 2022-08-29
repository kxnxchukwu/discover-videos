import videosData from "../data/videos.json";
import { getMyListVideos, getWatchedVideos } from "./db/hasura";

export const getCommonVideos = async (url) => {
    
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const BASE_URL = "youtube.googleapis.com/youtube/v3";
    const response = await fetch(`https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`)

    const data = await response.json();

    if (data?.error) {
        console.error("YouTube API Error", data.error);
        return videosData.items.map((item) => {
            const id = item.id?.videoId || item.id
            const snippet = item.snippet
              return {
                  title: snippet.title,
                  imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                  id,
                  description: snippet.description,
                  publishTime: snippet.publishAt,
                  channelTitle: snippet.channelTitle,
                  statistics: item.statistics ? item.statistics : {viewCount: 0},
              }
          })
    }
  
      return data?.items.map((item) => {
        const id = item.id?.videoId || item.id
        const snippet = item.snippet
        return {
            title: snippet.title,
            imgUrl:`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            id,
            description: snippet.description,
            publishTime: snippet.publishedAt ? snippet.publishedAt : null,
            channelTitle: snippet.channelTitle,
            statistics: item.statistics ? item.statistics : {viewCount: 0},
        }
      })
  } catch (error) {
    console.error("Something went wrong fetching videos", error);
    return [];
  }
};

export const getVideos = (searchQuery) => {
    const URL = `search?part=snippet&q=${searchQuery}`;
    return getCommonVideos(URL)
}

export const getPopularVideos = () => {
    const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=IE";
    return getCommonVideos(URL);
}

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  }) || [];
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || []
  );
};