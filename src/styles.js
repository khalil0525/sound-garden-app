export const songItem = (theme) => ({
  songItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gridTemplateRows: '1fr 1fr',
    width: '100%',

    alignItems: 'center',
    gap: '0.4rem',
    listStyle: 'none',

    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 5fr',
      gridTemplateRows: '1fr 1fr 1fr',
      justifyContent: 'flex-start',
      padding: '2rem',
    },
  },
  songItemHeader: {
    paddingLeft: '0.8rem',
    gridColumn: '2/-1',
    gridRow: '1',
    [theme.breakpoints.up('md')]: {
      gridColumn: '2/-1',
      gridRow: '1',
    },
  },
  songItemTitleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  titleContainerPlayBtn: {
    alignSelf: 'center',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    background: `${theme.palette.primary.main} !important`,
    width: '4rem',
    height: '4rem',
    border: 'none',
    boxShadow: '0 1px rgba(15, 15, 15, 0.5)',
    margin: '0 0.2rem 0 1rem',
    order: 2,
    [theme.breakpoints.up('md')]: {
      order: 0,
    },
  },
  titleContainerSongTitle: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.4rem',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexGrow: 0,
      alignItems: 'space-between',
      width: '100%',
    },
  },
  titleContainerSongTitleArtist: {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: 400,
    lineHeight: '1.6rem',
    color: '#999',
  },
  titleContainerSongTitleTitle: {
    fontSize: theme.typography.h3.fontSize,
    lineHeight: 1.2,
    fontWeight: 500,
    color: '#333',
  },
  titleContainerAdditional: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      alignSelf: 'flex-start',
      textAlign: 'right',
      gap: '0.4rem',
      marginLeft: '0.5rem',
    },
  },
  songItemFooter: {
    display: 'none',
    gridColumn: '2/2',
    gridRow: '3/3',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  actionContainerLikeBtnLiked: {
    boxShadow: '0 0 0 1px ' + theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  songItemAside: {
    gridColumn: '1',
    gridRow: '1/-1',
  },
  songItemSongPhotoContainer: {
    width: '6rem',
    height: '6rem',
    [theme.breakpoints.up('sm')]: {
      width: '8rem',
      height: '8rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '16rem',
      weight: '16rem',
    },
  },
  songPhotoContainerImg: {
    width: '100%',
    height: '100%',
    opacity: 1,
    borderRadius: '14px',
    boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
  },
  songItemSeekControl: {
    gridRow: '2',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.6rem',
    padding: '1.2rem',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-evenly',
      width: '100%',
      maxHeight: '16rem',
      gridRow: '2',
      gap: '0',
    },
  },
  songItemDuration: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: '1.9rem',
    maxWidth: '5%',
    color: '#161618',
  },
  songItemActionContainer: {
    display: 'flex',
    gap: '0.5rem',
  },
  songItemActionContainerFirst: {
    marginLeft: '1rem',
  },
  actionContainerBtn: {
    display: 'inline-block',
    gap: '0.8rem',
    alignItems: 'center',
    background: '#fff !important',
    border: '1px solid #ccc !important',
    borderRadius: '0.4rem !important',
    padding: '0.4rem 0.8rem !important',
    minWidth: '6.4rem',
    color: '#000 !important',
  },
  actionContainerBtnHover: {
    borderColor: '#ccc',
  },
  '@media only screen and (min-width: 992px)': {
    songItemHeader: {
      gridColumn: '2/3',
      gridRow: '1',
    },

    titleContainerAdditional: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      alignSelf: 'flex-start',
      textAlign: 'right',
      gap: '0.4rem',
      marginLeft: '0.5rem',
    },
    titleContainerAdditionalUploadDate: {
      display: 'block',
      color: '#ccc',
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 300,
      lineHeight: '1.6rem',
    },
    titleContainerAdditionalGenreContainer: {
      display: 'block',
      marginTop: '0.2rem',
      lineHeight: '1.2rem',
    },
    titleContainerAdditionalGenre: {
      padding: '0 0.6rem',
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 400,
      color: '#fff',
      textTransform: 'uppercase',
      backgroundColor: '#999',
      border: '1px solid #999',
      borderRadius: '2rem',
      height: '1.8rem',
    },
    songItemFooter: {
      display: 'block',
    },

    songItemSongPhotoContainer: {
      maxWidth: '16rem',
      maxHeight: '16rem',
    },
    songItemSeekControl: {
      gridColumn: '2/-1',
      width: '100%',
      '& input': {
        width: '100%',
      },
    },
    songItemSeekControlInput: {
      width: '100%',
    },
  },
  '@media (min-width: 768px) and (max-width: 991px)': {
    songItemSongPhotoContainer: {
      width: '12rem',
      height: '12rem',
    },
  },
  '@media (min-width: 992px) and (max-width: 1199px)': {
    songItemSongPhotoContainer: {
      width: '12rem',
      height: '12rem',
    },
  },
  '@media (min-width: 1200px)': {
    songItemSongPhotoContainer: {
      width: '12rem',
      height: '12rem',
    },
  },
  spinner: {
    color: theme.palette.primary.main,
  },
});
