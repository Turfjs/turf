#!/usr/bin/env python
"""Shapely helper script for Boolean validation"""

import sys
import json
from shapely.geometry import asShape

def shapely(operation, geometry1, geometry2):
    geometry1 = asShape(json.loads(geometry1))
    geometry2 = asShape(json.loads(geometry2))

    if operation == 'crosses':
        print geometry1.crosses(geometry2)
    elif operation == 'contains':
        print geometry1.conains(geometry2)

if __name__ == '__main__':
    OPERATION = sys.argv[1]
    FEATURE1 = sys.argv[2]
    FEATURE2 = sys.argv[3]
    shapely(OPERATION, FEATURE1, FEATURE2)
