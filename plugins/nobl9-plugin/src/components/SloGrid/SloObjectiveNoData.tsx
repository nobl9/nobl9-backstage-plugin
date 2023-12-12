import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import NoDataIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles({
  label: {
    color: '#383939',
    fontSize: 16,
    fontWeight: 500,
    textTransform: 'uppercase',
    marginLeft: 8,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const SloObjectiveNoData = () => {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item>
        <div className={classes.container}>
          <NoDataIcon />
          <Typography component="div" className={classes.label}>
            No data
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};
