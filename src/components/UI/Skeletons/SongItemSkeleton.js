import React from 'react';
import { Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { songItem } from '../../../styles';

const useStyles = makeStyles(songItem);

const SongItemSkeleton = ({ count }) => {
  const classes = useStyles();

  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <li
      className={classes.songItem}
      style={{ maxWidth: '900px', alignItems: 'normal', maxHeight: '180px' }}>
      <div className={classes.songItemHeader}>
        <div
          className={classes.songItemTitleContainer}
          style={{ alignItems: 'center', justifyContent: 'start' }}>
          <Skeleton
            className={classes.titleContainerPlayBtn}
            sx={{ bgcolor: 'grey.400' }}
            variant="circle"
            width={40}
            height={40}
          />

          <div className={classes.titleContainerSongTitle}>
            <Skeleton
              className={classes.titleContainerSongTitleArtist}
              variant="rect"
              sx={{ bgcolor: 'grey.400' }}
              width={120}
              height={20}
            />

            <Skeleton
              className={classes.titleContainerSongTitleTitle}
              variant="rect"
              sx={{ bgcolor: 'grey.400' }}
              width={120}
              height={20}
            />
          </div>
          <div className={classes.titleContainerAdditional}>
            <div className={classes.titleContainerAdditionalDateContainer}>
              <Skeleton
                className={classes.titleContainerAdditionalUploadDate}
                sx={{ bgcolor: 'grey.400' }}
                width={40}
                height={40}
              />
            </div>
            <div className={classes.titleContainerAdditionalGenreContainer}>
              <Skeleton
                sx={{ bgcolor: 'grey.400' }}
                variant="rect"
                width={50}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.songItemSeekControl}>
        <Skeleton
          sx={{ bgcolor: 'grey.400' }}
          width={'100%'}
          height={40}
        />
      </div>
      <div className={classes.songItemFooter}>
        <div className={classes.songItemActionContainer}>
          <Skeleton
            sx={{ bgcolor: 'grey.400' }}
            width={60}
            height={35}
          />
          <Skeleton
            sx={{ bgcolor: 'grey.400' }}
            width={60}
            height={35}
          />{' '}
          <Skeleton
            sx={{ bgcolor: 'grey.400' }}
            width={60}
            height={35}
          />{' '}
          <Skeleton
            sx={{ bgcolor: 'grey.400' }}
            width={60}
            height={35}
          />
        </div>
      </div>
      <div className={classes.songItemAside}>
        <div className={classes.songItemSongPhotoContainer}>
          <Skeleton
            className={classes.songPhotoContainerImg}
            sx={{ bgcolor: 'grey.400' }}
            width={'120px'}
            height={'200px'}
          />
        </div>
      </div>
    </li>
  ));

  return (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',

        maxWidth: '98rem',

        margin: '0 auto',
      }}>
      {skeletonItems}
    </ul>
  );
};

export default SongItemSkeleton;
