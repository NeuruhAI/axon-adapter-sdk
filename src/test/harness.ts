import { BaseAdapter } from '../adapter/base-adapter';
import { AdapterRequest } from '../adapter/types';

export interface HarnessResult {
  passed: boolean;
  failures: string[];
}

export async function runAdapterHarness(
  adapter: BaseAdapter,
  sampleRequest: AdapterRequest,
): Promise<HarnessResult> {
  const failures: string[] = [];

  try {
    if (!adapter.provider) failures.push('provider is empty');
    const info = adapter.getModelInfo();
    if (!info.model) failures.push('model name is empty');
    if (info.maxContext <= 0) failures.push('maxContext must be > 0');

    const healthy = await adapter.isHealthy();
    if (typeof healthy !== 'boolean') failures.push('isHealthy must return boolean');

    const res = await adapter.generate(sampleRequest);
    if (typeof res.content !== 'string') failures.push('response content must be string');
    if (res.provider !== adapter.provider) failures.push('response provider mismatch');
    if (res.tokensUsed.input < 0 || res.tokensUsed.output < 0) {
      failures.push('token counts must be >= 0');
    }
  } catch (err) {
    failures.push(`harness threw: ${err instanceof Error ? err.message : String(err)}`);
  }

  return { passed: failures.length === 0, failures };
}
