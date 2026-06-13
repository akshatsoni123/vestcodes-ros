import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): object {
    return { status: 'ok', app: 'ROS', version: '0.9' };
  }
}
