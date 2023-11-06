import React, { useEffect, useState, useRef } from 'react';
import styles from './ArtistList.module.css';
import SongItem from './ArtistItem';
import { useCollection } from '../../hooks/useCollection';
import InfiniteScroll from 'react-infinite-scroll-component';

//We receive a song prop from whichever parent component calls this
const SongList = ({ songs, user, className, playlistLocation, scrollRef }) => {
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
    <div className={`${styles['songList']} ${className} `}>
      <InfiniteScroll
        dataLength={current.length}
        next={getMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className={styles['songList__list']}
        style={{ width: '100%' }}
        scrollableTarget={scrollRef.current}>
        {current &&
          likedSongDocuments &&
          current.map((song, index) => (
            <SongItem
              song={song}
              key={song.docID}
              playlistSongs={songs}
              songIndex={index}
              liked={
                user.uid && likedSongDocuments && likedSongDocuments[0].likes
              }
              songPlaylistLocation={playlistLocation}
              user={user}
            />
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default SongList;
