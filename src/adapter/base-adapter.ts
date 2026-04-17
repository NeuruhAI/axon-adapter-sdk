import { AdapterRequest, AdapterResponse, ModelInfo } from './types';

export interface AdapterHooks {
  onRequest?(req: AdapterRequest): void | Promise<void>;
  onResponse?(res: AdapterResponse): void | Promise<void>;
  onError?(err: Error, req: AdapterRequest): void | Promise<void>;
}

export abstract class BaseAdapter {
  abstract readonly provider: string;
  protected hooks: AdapterHooks = {};

  abstract getModelInfo(): ModelInfo;
  abstract generate(request: AdapterRequest): Promise<AdapterResponse>;

  stream?(request: AdapterRequest): AsyncGenerator<string>;

  async isHealthy(): Promise<boolean> {
    return true;
  }

  attachHooks(hooks: AdapterHooks): this {
    this.hooks = { ...this.hooks, ...hooks };
    return this;
  }

  protected buildResponse(args: {
    content: string;
    inputTokens: number;
    outputTokens: number;
    startedAt?: number;
    metadata?: Record<string, unknown>;
  }): AdapterResponse {
    const info = this.getModelInfo();
    const cost =
      (args.inputTokens / 1000) * info.costPer1kInput +
      (args.outputTokens / 1000) * info.costPer1kOutput;
    return {
      content: args.content,
      model: info.model,
      provider: this.provider,
      tokensUsed: { input: args.inputTokens, output: args.outputTokens },
      cost,
      latencyMs: args.startedAt ? Date.now() - args.startedAt : 0,
      metadata: args.metadata,
    };
  }
}
