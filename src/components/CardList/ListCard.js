import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',

    maxWidth: '19rem',
    minWidth: '12rem',
    maxHeight: '15.8rem',
    minHeight: '12rem',
    borderRadius: '10px',
    listStyle: 'none',
    background: theme.palette.secondary.main,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
  cardTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '90%',
    height: '4.8rem',
    background: 'rgba(20, 3, 3, 0.4)',
    boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.03)',
    backdropFilter: 'blur(5px)',
    borderRadius: '10px',
    marginBottom: '1rem',
  },
  cardTitleText: {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: 500,
    textAlign: 'center',
  },
  cardContent: {},
  '@media only screen and (min-width: 1600px)': {},
}));

const ListCard = ({ background, title, content }) => {
  const classes = useStyles();

  return (
    <li
      className={`${classes.card} ${background ? classes[background] : ''}`}
      style={background ? { backgroundImage: `url(${background})` } : {}}>
      {title && (
        <div className={classes.cardTitle}>
          <p className={classes.cardTitleText}>{title.toUpperCase()}</p>
          {content && <div className={classes.cardContent}>{content}</div>}
        </div>
      )}
    </li>
  );
};

ListCard.propTypes = {
  background: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.node,
};

export default ListCard;
