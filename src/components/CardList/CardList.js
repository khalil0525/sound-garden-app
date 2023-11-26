import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import ListCard from './ListCard';

const useStyles = makeStyles((theme) => ({
  cardlist: {
    maxWidth: '100%',
  },
  cardlistList: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  cardLink: {
    textDecoration: 'none',
    color: theme.palette.common.white,
    '&:hover, &:active': {
      textDecoration: 'none',
      color: theme.palette.common.white,
    },
  },
}));

const CardList = ({ list, page, className }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.cardlist} ${className}`}>
      <Grid
        container
        spacing={2}
        className={classes.cardlistList}>
        {list &&
          list.map((item, index) => (
            <Grid
              item
              key={item.title}
              xs={12}
              sm={6}
              md={4}
              lg={3}>
              <Link
                to={`/${page}/${item.title}`}
                state={{
                  from: page.substring(0, page.length - 1),
                  search: item.title,
                }}
                className={classes.cardLink}>
                <ListCard
                  title={item.title}
                  content={item.content}
                  background={item.background}
                />
              </Link>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default CardList;
