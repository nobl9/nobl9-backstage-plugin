import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { Composite, Objective } from '../../types';

const useStyles = makeStyles(theme => ({
  value: {
    color: theme.palette.type === 'dark' ? '#fff' : '#383838',
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  label: {
    color: theme.palette.type === 'dark' ? '#BABBBB' : '#767676',
    fontSize: 12,
    fontWeight: 400,
  },
}));

type SloObjectiveDetailsProps = {
  objective: Objective | Composite;
};

export const SloObjectiveDetails = ({
  objective,
}: SloObjectiveDetailsProps) => {
  const classes = useStyles();

  const toHours = (value: number) => (value / 3600).toFixed(1);
  const getBurnRate = (burnRate: number) => {
    if (!burnRate) return 0;

    return burnRate % 1 !== 0 ? burnRate.toFixed(2) : burnRate;
  };

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography className={classes.value} component="div">
          {toHours(objective.errorBudgetRemaining)}&nbsp;hr
        </Typography>
        <Typography className={classes.label} component="div">
          Error Budget
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          className={classes.value}
          component="div"
          title={`${objective.errorBudgetRemainingPercentage * 100}`}
        >
          {(objective.errorBudgetRemainingPercentage * 100).toFixed(0)}%
        </Typography>
        <Typography className={classes.label} component="div">
          Error Budget %
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          className={classes.value}
          component="div"
          title={`${objective.burnRate}`}
        >
          {getBurnRate(objective.burnRate)}x
        </Typography>
        <Typography className={classes.label} component="div">
          Burn Rate
        </Typography>
      </Grid>
    </Grid>
  );
};
