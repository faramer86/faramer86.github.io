---
title: Calibrating pathogenicity scores
date: 2026-04-12
summary: A per-gene calibration curve turns raw predictor scores into posteriors.
tags: [genomics, statistics]
draft: false
---

Most pathogenicity predictors output an **uncalibrated** score. When you push
`REVEL` through a trio-aware prior, the raw number stops being comparable across
genes.

The posterior is

$$P(\text{pathogenic} \mid s) = \frac{s \cdot \pi}{s \cdot \pi + (1 - s)(1 - \pi)}$$

where $\pi$ is the per-gene prior.

```python
def calibrate(score: float, prior: float) -> float:
    return score * prior / (score * prior + (1 - score) * (1 - prior))
```
