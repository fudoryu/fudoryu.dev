---
title: Idempotency is the immovable part of a pipeline
description: Retries, backfills and partial failures are certain. A pipeline that gives the same result when run twice is the one property that lets everything else move.
date: 2026-11-14
tags: [data engineering, pipelines]
---

Every pipeline will run twice. A scheduler retries after a timeout, someone triggers a
backfill, a node dies halfway through a write. The question isn't whether a job reruns,
but whether rerunning it changes the answer.

## Write to a partition, not to a table

The most common failure is an `INSERT` that appends. Run it twice and every row is
doubled. The fix is to make each run own a slice of the output and replace that slice
whole:

```python title="load.py" {6-9}
def load_day(spark, day: str) -> None:
    df = (
        spark.read.parquet(f"s3://raw/events/dt={day}")
        .dropDuplicates(["event_id"])
    )
    (df.write
       .mode("overwrite")
       .option("replaceWhere", f"dt = '{day}'")
       .saveAsTable("analytics.events"))
```

Now the job is a function of its input day. Running it once or five times leaves the
table in the same state.

## Three rules I keep

1. **Every run is keyed by its logical time**, never by "now".
2. **Writes replace a well-defined slice**: a partition, a merge key, a file prefix.
3. **Side effects happen last and are deduplicated**: emails, webhooks and API calls
   carry an idempotency key.

Get these right and retries become boring, which is exactly what you want from them.
