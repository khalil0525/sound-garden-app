import React, { useEffect, useState, useRef } from 'react';
import SongItem from './MiniSongItem';
import { useCollection } from '../../hooks/useCollection';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box } from '@mui/material';

//We receive a song prop from whichever parent component calls this
const MiniSongList = ({
  songs,
  user,
  className,
  playlistLocation,
  scrollRef,
}) => {
  //New Like system
  const { documents: likedSongDocuments } = useCollection('likes', [
    '__name__',
    '==',
    user.uid ? user.uid : 'none',
  ]);

  const [count, setCount] = useState({
    prev: 0,
    next: 4,
  });
  const [hasMore, setHasMore] = useState(true);
  const [current, setCurrent] = useState(songs.slice(count.prev, count.next));
  const songsRef = useRef(songs);

  const getMoreData = () => {
    if (current.length === songs.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setCurrent(current.concat(songs.slice(count.prev + 4, count.next + 4)));
    }, 2000);
    setCount((prevState) => ({
      prev: prevState.prev + 4,
      next: prevState.next + 4,
    }));
  };
  // This is used to reload the songList whenever a songs properties are updated
  useEffect(() => {
    if (JSON.stringify(songsRef.current) !== JSON.stringify(songs)) {
      songsRef.current = songs;
      setCurrent(songs.slice(0, count.next));
    }
  }, [songs, count.next]);

  return (
    <Box className={`${className} `}>
      <InfiniteScroll
        dataLength={current.length}
        next={getMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
        }}
        scrollableTarget={scrollRef.current}>
        {current &&
          likedSongDocuments &&
          current.map((song, index) => (
            <SongItem
              song={song}
              key={song.docID}
              playlistSongs={songs}
              songIndex={index}
              liked={song?.likes?.some((like) => like.id === user.id || false)}
              songPlaylistLocation={playlistLocation}
              user={user}
            />
          ))}
      </InfiniteScroll>
    </Box>
  );
};

export default MiniSongList;
