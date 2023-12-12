import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InfoCard } from '@backstage/core-components';
import { Chip, Divider, Typography } from '@material-ui/core';
import OkIcon from '@material-ui/icons/CheckCircle';
import AttentionIcon from '@material-ui/icons/Error';
import { Composite, Objective } from '../../types';
import { SloObjectiveDetails } from './SloObjectiveDetails';
import { SloObjectiveNoData } from './SloObjectiveNoData';

const useStyles = makeStyles({
  objectiveContainer: {
    minWidth: 400,
    marginRight: 16,
    paddingBottom: 2,
    paddingLeft: 2,
  },
  objectiveNameContainer: {
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  compositeChip: {
    margin: 0,
    color: '#fff',
    backgroundColor: '#0081BA',
  },
});

type SloObjectiveProps = {
  objective: Objective | Composite;
  composite?: boolean;
};

export const SloObjective = ({ objective, composite }: SloObjectiveProps) => {
  const classes = useStyles();

  const needsAttention = () =>
    objective.errorBudgetRemaining <= 0 || objective.burnRate >= 1;
  const getObjectiveName = (obj: Objective) => obj.displayName || obj.name;

  return (
    <div className={classes.objectiveContainer}>
      <InfoCard>
        <div>
          <div>
            <div className={classes.objectiveNameContainer}>
              {needsAttention() ? (
                <AttentionIcon htmlColor="#D42E56" />
              ) : (
                <OkIcon htmlColor="#0EB46E" />
              )}
              <span style={{ marginLeft: 16 }}>
                {composite ? (
                  <Chip
                    label="Composite"
                    size="small"
                    className={classes.compositeChip}
                  />
                ) : (
                  getObjectiveName(objective as Objective)
                )}
              </span>
            </div>
            <div>
              <Typography
                style={{
                  fontSize: 12,
                  marginTop: 6,
                  fontWeight: 500,
                  color: '#616161',
                }}
              >
                Target: {Number.parseFloat((objective.target * 100).toFixed(5))}
                %
              </Typography>
            </div>
          </div>
          <Divider
            style={{
              marginTop: 12,
              marginBottom: 16,
              marginLeft: -16,
              marginRight: -16,
              backgroundColor: needsAttention() ? '#D42E56' : '#0EB46E',
            }}
          />
          {objective.errorBudgetRemaining ? (
            <SloObjectiveDetails objective={objective} />
          ) : (
            <SloObjectiveNoData />
          )}
        </div>
      </InfoCard>
    </div>
  );
};
