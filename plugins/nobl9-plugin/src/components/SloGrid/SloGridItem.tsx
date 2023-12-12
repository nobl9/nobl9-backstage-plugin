import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { HorizontalScrollGrid } from '@backstage/core-components';
import { Button, Chip, Grid, Typography } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LabelIcon from '@material-ui/icons/LocalOffer';
import { CompositeIcon, SloIcon } from '../Icons';
import { SloObjective } from './SloObjective';
import { Slo } from '../../types';

const useStyles = makeStyles({
  sloHeaderContainer: {
    marginBottom: 20,
  },
  sloHeaderContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sloIcon: {
    marginRight: 10,
    overflow: 'visible',
  },
  sloName: {
    fontSize: 18,
    marginBottom: 0,
  },
  sloSubHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  objectivesCount: {
    color: '#767676',
    fontSize: 12,
    marginRight: 8,
  },
  detailsButton: {
    color: '#2E77D0',
    fontWeight: 600,
    letterSpacing: 1,
    fontSize: 12,
  },
  objectivesContainer: {
    marginBottom: 16,
  },
});

type SloGridItemProps = {
  slo: Slo;
  detailsBaseUrl: string;
  organization: string;
};

export const SloGridItem = ({
  slo,
  detailsBaseUrl,
  organization,
}: SloGridItemProps) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} key={slo.name}>
      <div className={classes.sloHeaderContainer}>
        <Grid container direction="row" spacing={4} alignItems="center">
          <Grid item>
            <div className={classes.sloHeaderContent}>
              {slo.composite ? (
                <CompositeIcon
                  htmlColor="#0081ba"
                  className={classes.sloIcon}
                />
              ) : (
                <SloIcon htmlColor="#0081ba" className={classes.sloIcon} />
              )}
              <Typography variant="h5" className={classes.sloName}>
                SLO: {slo.displayName || slo.name}
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <Button
              className={classes.detailsButton}
              variant="text"
              color="primary"
              target="_blank"
              href={`${detailsBaseUrl}/slo/details?org=${organization}&name=${slo.name}&project=${slo.project}&opt=currentTimeWindow&autorefresh=true`}
              endIcon={<OpenInNewIcon />}
            >
              Check SLO Details in N9
            </Button>
          </Grid>
        </Grid>
        <Grid style={{ marginTop: 4 }}>
          <div className={classes.sloSubHeaderContainer}>
            <Typography className={classes.objectivesCount} component="span">
              <strong>Objectives:</strong>&nbsp;{slo.objectives.length}
            </Typography>
            <Grid container spacing={1}>
              {slo.labels &&
                Object.keys(slo.labels).map(key =>
                  slo.labels[key].map(label => (
                    <Grid item>
                      <Chip
                        key={`${key}${label}`}
                        label={`${key} : ${label}`}
                        size="small"
                        style={{ margin: 0 }}
                        icon={<LabelIcon style={{ color: '#BE7E7E ' }} />}
                      />
                    </Grid>
                  )),
                )}
            </Grid>
          </div>
        </Grid>
      </div>

      <div className={classes.objectivesContainer}>
        <HorizontalScrollGrid scrollStep={400}>
          {!!slo.composite && (
            <SloObjective objective={slo.composite} composite />
          )}
          {slo.objectives.map(objective => (
            <SloObjective key={objective.name} objective={objective} />
          ))}
        </HorizontalScrollGrid>
      </div>
    </Grid>
  );
};
