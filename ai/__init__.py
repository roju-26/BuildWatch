"""BuildWatch AI module. Backend usage:

    from ai import analyze_image, compute_similarity, compare_before_after
"""
from ai.inference.analyser import analyze_image, compute_similarity
from ai.inference.comparison import compare_before_after

__all__ = ["analyze_image", "compute_similarity", "compare_before_after"]