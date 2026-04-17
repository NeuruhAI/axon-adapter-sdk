# AXON Adapter SDK

Plugin development kit for the [AXON Gateway](https://github.com/NeuruhAI/neuruh-axon). Build third-party adapters and tools that plug into AXON's permission-first execution pipeline.

## Install

```bash
npm install @neuruh/axon-adapter-sdk
```

## What you can build

- **Model adapters** — connect any LLM provider (local or cloud) to the gateway
- **Tool plugins** — add new tools with permission schemas + risk classification
- **Middleware** — request/response transformations, logging, metrics

## 60-second adapter

```typescript
import { BaseAdapter, AdapterRequest, AdapterResponse, ModelInfo } from '@neuruh/axon-adapter-sdk';

export class MyAdapter extends BaseAdapter {
  readonly provider = 'my-provider';

  getModelInfo(): ModelInfo {
    return {
      provider: 'my-provider',
      model: 'my-model-v1',
      maxContext: 8192,
      costPer1kInput: 0.01,
      costPer1kOutput: 0.03,
      supportsStreaming: true,
      supportsToolCalls: false,
      isLocal: false,
    };
  }

  async generate(request: AdapterRequest): Promise<AdapterResponse> {
    // Your implementation here
    return this.buildResponse({ content: 'hello', inputTokens: 5, outputTokens: 1 });
  }
}
```

Register it with the gateway:

```typescript
import { ModelRouter } from '@neuruh/axon';
import { MyAdapter } from './my-adapter';

const router = new ModelRouter();
router.registerAdapter(new MyAdapter());
```

## 60-second tool

```typescript
import { defineTool, PermissionLevel } from '@neuruh/axon-adapter-sdk';
import { z } from 'zod';

export const weatherTool = defineTool({
  name: 'weather_lookup',
  description: 'Look up current weather for a city.',
  permission: PermissionLevel.READ,
  schema: z.object({ city: z.string() }),
  async execute({ city }) {
    const res = await fetch(`https://api.example.com/weather?city=${encodeURIComponent(city)}`);
    return await res.json();
  },
});
```

## Testing

```bash
npm test
```

Every adapter ships with a conformance harness (`AdapterTestHarness`) that verifies health checks, request/response shape, and streaming semantics.

## License

MIT
