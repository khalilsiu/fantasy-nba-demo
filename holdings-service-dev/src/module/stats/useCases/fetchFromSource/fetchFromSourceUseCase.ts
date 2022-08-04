import { Injectable, Logger } from '@nestjs/common';
import fetch from 'cross-fetch';
import { DclStats, METAVERSE } from 'src/module/stats/domain/dclStats';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { Either, Result, right, left } from 'src/shared/core/Result';
import { StatsMapper } from '../../stats.mapper';
type Response = Either<
  DomainModelCreationError | UnexpectedError,
  Result<DclStats[]>
>;

const uri = process.env.DCL_STATS_URL || 'https://cdn-data.decentraland.org';

@Injectable()
export class FetchFromSourceUseCase {
  private readonly logger = new Logger(FetchFromSourceUseCase.name);
  public async exec(metaverse: string): Promise<Response> {
    try {
      this.logger.log(`fetchFromSource`);

      let stats: DclStats[];

      if (metaverse === METAVERSE.DECENTRALAND) {
        const fetchDclStatsUri = `${uri}/scenes/scene-stats.json`;

        this.logger.log(`fetchFromSource ${metaverse} ${fetchDclStatsUri}`);

        const res = await fetch(fetchDclStatsUri);
        const dclStats = await res.json();

        stats = StatsMapper.processDclStatsFromSource(dclStats);

        this.logger.log(`fetchFromSource ${metaverse} ${stats.length} results`);
      }

      return right(Result.ok<DclStats[]>(stats));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
