import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import SongItem from './SongItem';
import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles((theme) => ({
  songList: {
    // Add your styles for songList container
  },
  songListList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    alignItems: 'center',

    justifyContent: 'center',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {},
  },
}));

const SongList = ({ songs, user, className, playlistLocation }) => {
  const classes = useStyles();

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

  useEffect(() => {
    if (JSON.stringify(songsRef.current) !== JSON.stringify(songs)) {
      songsRef.current = songs;
      setCurrent(songs.slice(0, count.next));
    }
  }, [songs, count.next]);

  return (
    <div className={`${classes.songList} ${className}`}>
      <InfiniteScroll
        dataLength={current.length}
        next={getMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className={classes.songListList}>
        {current?.length &&
          current.map((song, index) => (
            <SongItem
              song={song}
              key={song.docID}
              playlistSongs={songs}
              songIndex={index}
              songId={song.docID}
              liked={song?.likes?.some((like) => like.id === user.id || false)}
              songPlaylistLocation={playlistLocation}
              user={user}
            />
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default SongList;
