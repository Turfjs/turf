import {
  feature,
  point,
  lineString,
  isObject,
  AllGeoJSON,
  Id,
  Lines,
} from "@turf/helpers";
import {
  BBox,
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  GeometryCollection,
  GeometryObject,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {number[]} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @returns {void | false} Return false to stop iterating
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @function
 * @param {AllGeoJSON} geojson any GeoJSON object
 * @param {coordEachCallback} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function coordEach(
  geojson: AllGeoJSON,
  callback: (
    currentCoord: number[],
    coordIndex: number,
    featureIndex: number,
    multiFeatureIndex: number,
    geometryIndex: number
  ) => void | false,
  excludeWrapCoord?: boolean
): void | false {
  // Handles null Geometry -- Skips this GeoJSON
  if (geojson === null) return;
  var j,
    k,
    l,
    geometry,
    stopG,
    coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    coordIndex = 0,
    isGeometryCollection,
    type = geojson.type,
    isFeatureCollection = type === "FeatureCollection",
    isFeature = type === "Feature",
    stop = isFeatureCollection
      ? (geojson as FeatureCollection).features.length
      : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection
      ? (geojson as FeatureCollection).features[featureIndex].geometry
      : isFeature
        ? (geojson as Feature).geometry
        : geojson;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? (geometryMaybeCollection as GeometryCollection).geometries.length
      : 1;

    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0;
      var geometryIndex = 0;
      geometry = isGeometryCollection
        ? (geometryMaybeCollection as GeometryCollection).geometries[geomIndex]
        : geometryMaybeCollection;

      // Handles null Geometry -- Skips this geometry
      if (geometry === null) continue;
      coords = (
        geometry as
          | Point
          | LineString
          | Polygon
          | MultiPoint
          | MultiLineString
          | MultiPolygon
      ).coordinates;
      var geomType = geometry.type;

      wrapShrink =
        excludeWrapCoord &&
        (geomType === "Polygon" || geomType === "MultiPolygon")
          ? 1
          : 0;

      switch (geomType) {
        case null:
          break;
        case "Point":
          if (
            callback(
              coords as Point["coordinates"],
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false
          )
            return false;
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          for (j = 0; j < coords.length; j++) {
            if (
              callback(
                (
                  coords as
                    | LineString["coordinates"]
                    | MultiPoint["coordinates"]
                )[j],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false
            )
              return false;
            coordIndex++;
            if (geomType === "MultiPoint") multiFeatureIndex++;
          }
          if (geomType === "LineString") multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          for (
            j = 0;
            j <
            (coords as Polygon["coordinates"] | MultiLineString["coordinates"])
              .length;
            j++
          ) {
            for (
              k = 0;
              k <
              (
                coords as
                  | Polygon["coordinates"]
                  | MultiLineString["coordinates"]
              )[j].length -
                wrapShrink;
              k++
            ) {
              if (
                callback(
                  (
                    coords as
                      | Polygon["coordinates"]
                      | MultiLineString["coordinates"]
                  )[j][k],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false
              )
                return false;
              coordIndex++;
            }
            if (geomType === "MultiLineString") multiFeatureIndex++;
            if (geomType === "Polygon") geometryIndex++;
          }
          if (geomType === "Polygon") multiFeatureIndex++;
          break;
        case "MultiPolygon":
          for (j = 0; j < (coords as MultiPolygon["coordinates"]).length; j++) {
            geometryIndex = 0;
            for (
              k = 0;
              k < (coords as MultiPolygon["coordinates"])[j].length;
              k++
            ) {
              for (
                l = 0;
                l <
                (coords as MultiPolygon["coordinates"])[j][k].length -
                  wrapShrink;
                l++
              ) {
                if (
                  callback(
                    (coords as MultiPolygon["coordinates"])[j][k][l],
                    coordIndex,
                    featureIndex,
                    multiFeatureIndex,
                    geometryIndex
                  ) === false
                )
                  return false;
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (
            j = 0;
            j < (geometry as GeometryCollection).geometries.length;
            j++
          )
            if (
              coordEach(
                (geometry as GeometryCollection).geometries[j],
                callback,
                excludeWrapCoord
              ) === false
            )
              return false;
          break;
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
  }
}

/**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback coordReduceCallback
 * @param {Reducer} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {number[]} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @returns {Reducer}
 */

/**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @function
 * @param {AllGeoJSON} geojson any GeoJSON object
 * @param {coordReduceCallback} callback a method that takes (previousValue, currentCoord, coordIndex)
 * @param {Reducer} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {Reducer} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentCoord;
 * });
 */
function coordReduce<Reducer>(
  geojson: AllGeoJSON,
  callback: (
    previousValue: Reducer,
    currentCoord: number[],
    coordIndex: number,
    featureIndex: number,
    multiFeatureIndex: number,
    geometryIndex: number
  ) => Reducer,
  initialValue?: Reducer,
  excludeWrapCoord?: boolean
): Reducer {
  var previousValue = initialValue;
  coordEach(
    geojson,
    function (
      currentCoord,
      coordIndex,
      featureIndex,
      multiFeatureIndex,
      geometryIndex
    ) {
      if (coordIndex === 0 && initialValue === undefined)
        previousValue = currentCoord as Reducer;
      else
        previousValue = callback(
          previousValue as Reducer,
          currentCoord,
          coordIndex,
          featureIndex,
          multiFeatureIndex,
          geometryIndex
        );
    },
    excludeWrapCoord
  );
  return previousValue as Reducer;
}

/**
 * Callback for propEach
 *
 * @callback propEachCallback
 * @param {GeoJsonProperties} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @returns {void | false} Returning false to stop iterating
 */

/**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @function
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {propEachCallback} callback a method that takes (currentProperties, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propEach(features, function (currentProperties, featureIndex) {
 *   //=currentProperties
 *   //=featureIndex
 * });
 */
function propEach<Props extends GeoJsonProperties>(
  geojson: Feature<any> | FeatureCollection<any> | Feature<GeometryCollection>,
  callback: (currentProperties: Props, featureIndex: number) => void | false
): void {
  var i;
  switch (geojson.type) {
    case "FeatureCollection":
      for (i = 0; i < geojson.features.length; i++) {
        if (
          callback(
            (geojson as FeatureCollection).features[i].properties as Props,
            i
          ) === false
        )
          break;
      }
      break;
    case "Feature":
      callback(geojson.properties as Props, 0);
      break;
  }
}

/**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback propReduceCallback
 * @param {Reducer} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {GeoJsonProperties} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @returns {Reducer}
 */

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @function
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {propReduceCallback} callback a method that takes (previousValue, currentProperties, featureIndex)
 * @param {Reducer} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {Reducer} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=featureIndex
 *   return currentProperties
 * });
 */
function propReduce<Reducer, P extends GeoJsonProperties = GeoJsonProperties>(
  geojson: Feature<any, P> | FeatureCollection<any, P> | Geometry,
  callback: (
    previousValue: Reducer,
    currentProperties: P,
    featureIndex: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer {
  var previousValue = initialValue;
  propEach(
    geojson as Feature<any, P> | FeatureCollection<any, P>,
    function (currentProperties, featureIndex) {
      if (featureIndex === 0 && initialValue === undefined)
        previousValue = currentProperties as Reducer;
      else
        previousValue = callback(
          previousValue as Reducer,
          currentProperties as P,
          featureIndex
        );
    }
  );
  return previousValue as Reducer;
}

/**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @returns {void | false} Return false to stop iterating
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @function
 * @param {FeatureCollection|Feature|Feature<GeometryCollection>} geojson any GeoJSON object
 * @param {featureEachCallback} callback a method that takes (currentFeature, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
function featureEach<
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | Feature<GeometryCollection, P>,
  callback: (
    currentFeature: Feature<G, P>,
    featureIndex: number
  ) => void | false
): void {
  if (geojson.type === "Feature") {
    callback(geojson as Feature<G, P>, 0);
  } else if (geojson.type === "FeatureCollection") {
    for (var i = 0; i < geojson.features.length; i++) {
      if (
        callback((geojson as FeatureCollection<G, P>).features[i], i) === false
      )
        break;
    }
  }
}

/**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback featureReduceCallback
 * @param {Reducer} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @returns {Reducer}
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @function
 * @param {FeatureCollection|Feature|Feature<GeometryCollection>} geojson any GeoJSON object
 * @param {featureReduceCallback} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {Reducer} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {Reducer} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   return currentFeature
 * });
 */
function featureReduce<
  Reducer,
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | Feature<GeometryCollection, P>,
  callback: (
    previousValue: Reducer,
    currentFeature: Feature<G, P>,
    featureIndex: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer {
  var previousValue = initialValue;
  featureEach(geojson, function (currentFeature, featureIndex) {
    if (featureIndex === 0 && initialValue === undefined)
      previousValue = currentFeature as Reducer;
    else
      previousValue = callback(
        previousValue as Reducer,
        currentFeature,
        featureIndex
      );
  });
  return previousValue as Reducer;
}

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @function
 * @param {AllGeoJSON} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
function coordAll(geojson: AllGeoJSON): number[][] {
  var coords: number[][] = [];
  coordEach(geojson, function (coord) {
    coords.push(coord);
  });
  return coords;
}

/**
 * Callback for geomEach
 *
 * @callback geomEachCallback
 * @param {GeometryObject} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {GeoJsonProperties} featureProperties The current Feature Properties being processed.
 * @param {BBox} featureBBox The current Feature BBox being processed.
 * @param {Id} featureId The current Feature Id being processed.
 * @returns {void}
 */

/**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @function
 * @param {FeatureCollection|Feature|Geometry|GeometryObject|Feature<GeometryCollection>} geojson any GeoJSON object
 * @param {geomEachCallback} callback a method that takes (currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomEach(features, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 * });
 */
function geomEach<
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    currentGeometry: G,
    featureIndex: number,
    featureProperties: P,
    featureBBox: BBox | undefined,
    featureId: Id | undefined
  ) => void | false
): void | false {
  var i,
    j,
    g,
    geometry,
    stopG,
    geometryMaybeCollection,
    isGeometryCollection,
    featureProperties,
    featureBBox,
    featureId,
    featureIndex = 0,
    isFeatureCollection = geojson.type === "FeatureCollection",
    isFeature = geojson.type === "Feature",
    stop = isFeatureCollection
      ? (geojson as FeatureCollection<G, P>).features.length
      : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = isFeatureCollection
      ? (geojson as FeatureCollection<G, P>).features[i].geometry
      : isFeature
        ? (geojson as Feature<G, P>).geometry
        : geojson;
    featureProperties = isFeatureCollection
      ? (geojson as FeatureCollection<G, P>).features[i].properties
      : isFeature
        ? (geojson as Feature<G, P>).properties
        : {};
    featureBBox = isFeatureCollection
      ? (geojson as FeatureCollection<G, P>).features[i].bbox
      : isFeature
        ? geojson.bbox
        : undefined;
    featureId = isFeatureCollection
      ? (geojson as FeatureCollection<G, P>).features[i].id
      : isFeature
        ? (geojson as Feature<G, P>).id
        : undefined;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? (geometryMaybeCollection as GeometryCollection).geometries.length
      : 1;

    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection
        ? (geometryMaybeCollection as GeometryCollection).geometries[g]
        : geometryMaybeCollection;

      // Handle null Geometry
      if (geometry === null) {
        if (
          callback(
            null as unknown as G,
            featureIndex,
            featureProperties as P,
            featureBBox,
            featureId
          ) === false
        )
          return false;
        continue;
      }
      switch (geometry.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (
            callback(
              geometry as G,
              featureIndex,
              featureProperties as P,
              featureBBox,
              featureId
            ) === false
          )
            return false;
          break;
        }
        case "GeometryCollection": {
          for (j = 0; j < geometry.geometries.length; j++) {
            if (
              callback(
                geometry.geometries[j] as G,
                featureIndex,
                featureProperties as P,
                featureBBox,
                featureId
              ) === false
            )
              return false;
          }
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    // Only increase `featureIndex` per each feature
    featureIndex++;
  }
}

/**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback geomReduceCallback
 * @param {Reducer} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {GeometryObject} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {GeoJsonProperties} featureProperties The current Feature Properties being processed.
 * @param {BBox} featureBBox The current Feature BBox being processed.
 * @param {Id} featureId The current Feature Id being processed.
 * @returns {Reducer}
 */

/**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @function
 * @param {FeatureCollection|Feature|GeometryObject|GeometryCollection|Feature<GeometryCollection>} geojson any GeoJSON object
 * @param {geomReduceCallback} callback a method that takes (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @param {Reducer} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {Reducer} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 *   return currentGeometry
 * });
 */
function geomReduce<
  Reducer,
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    previousValue: Reducer,
    currentGeometry: G,
    featureIndex: number,
    featureProperties: P,
    featureBBox: BBox | undefined,
    featureId: Id | undefined
  ) => Reducer,
  initialValue?: Reducer
): Reducer {
  var previousValue = initialValue;
  geomEach(
    geojson,
    function (
      currentGeometry,
      featureIndex,
      featureProperties,
      featureBBox,
      featureId
    ) {
      if (featureIndex === 0 && initialValue === undefined)
        previousValue = currentGeometry as unknown as Reducer;
      else
        previousValue = callback(
          previousValue as Reducer,
          currentGeometry,
          featureIndex,
          featureProperties,
          featureBBox,
          featureId
        );
    }
  );
  return previousValue as Reducer;
}

/**
 * Callback for flattenEach
 *
 * @callback flattenEachCallback
 * @param {Feature} currentFeature The current flattened feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @returns {void}
 */

/**
 * Iterate over flattened features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @function
 * @param {FeatureCollection|Feature|GeometryObject|GeometryCollection|Feature<GeometryCollection>} geojson any GeoJSON object
 * @param {flattenEachCallback} callback a method that takes (currentFeature, featureIndex, multiFeatureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenEach(features, function (currentFeature, featureIndex, multiFeatureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 * });
 */
function flattenEach<
  G extends GeometryObject = GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    currentFeature: Feature<G, P>,
    featureIndex: number,
    multiFeatureIndex: number
  ) => void | boolean
): void {
  geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
    // Callback for single geometry
    var type = geometry === null ? null : geometry.type;
    switch (type) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        if (
          callback(
            feature(geometry, properties, { bbox: bbox, id: id }),
            featureIndex,
            0
          ) === false
        )
          return false;
        return;
    }

    var geomType;

    // Callback for multi-geometry
    switch (type) {
      case "MultiPoint":
        geomType = "Point";
        break;
      case "MultiLineString":
        geomType = "LineString";
        break;
      case "MultiPolygon":
        geomType = "Polygon";
        break;
    }

    for (
      var multiFeatureIndex = 0;
      multiFeatureIndex <
      (geometry as MultiPoint | MultiLineString | MultiPolygon).coordinates
        .length;
      multiFeatureIndex++
    ) {
      var coordinate = (geometry as MultiPoint | MultiLineString | MultiPolygon)
        .coordinates[multiFeatureIndex];
      var geom = {
        type: geomType,
        coordinates: coordinate,
      };
      if (
        callback(
          feature(geom as Point | LineString | Polygon, properties) as Feature<
            G,
            P
          >,
          featureIndex,
          multiFeatureIndex
        ) === false
      )
        return false;
    }
  });
}

/**
 * Callback for flattenReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback flattenReduceCallback
 * @param {Reducer} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @returns {Reducer}
 */

/**
 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
 *
 * @function
 * @param {FeatureCollection|Feature|GeometryObject|GeometryCollection|Feature<GeometryCollection>} geojson any GeoJSON object
 * @param {flattenReduceCallback} callback a method that takes (previousValue, currentFeature, featureIndex, multiFeatureIndex)
 * @param {Reducer} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {Reducer} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, multiFeatureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   return currentFeature
 * });
 */
function flattenReduce<
  Reducer,
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    previousValue: Reducer,
    currentFeature: Feature<G, P>,
    featureIndex: number,
    multiFeatureIndex: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer {
  var previousValue = initialValue;
  flattenEach(
    geojson,
    function (currentFeature, featureIndex, multiFeatureIndex) {
      if (
        featureIndex === 0 &&
        multiFeatureIndex === 0 &&
        initialValue === undefined
      )
        previousValue = currentFeature as Reducer;
      else
        previousValue = callback(
          previousValue as Reducer,
          currentFeature,
          featureIndex,
          multiFeatureIndex
        );
    }
  );
  return previousValue as Reducer;
}

/**
 * Callback for segmentEach
 *
 * @callback segmentEachCallback
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 * @returns {void | false} Return false to stop iterating
 */

/**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {AllGeoJSON} geojson any GeoJSON
 * @param {segmentEachCallback} callback a method that takes (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex)
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentEach(polygon, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //=currentSegment
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   //=segmentIndex
 * });
 *
 * // Calculate the total number of segments
 * var total = 0;
 * turf.segmentEach(polygon, function () {
 *     total++;
 * });
 */
function segmentEach<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson: AllGeoJSON,
  callback: (
    currentSegment?: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    segmentIndex?: number,
    geometryIndex?: number
  ) => void | boolean
): void {
  flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
    var segmentIndex = 0;

    // Exclude null Geometries
    if (!feature.geometry) return;
    // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
    var type = feature.geometry.type;
    if (type === "Point" || type === "MultiPoint") return;

    // Generate 2-vertex line segments
    var previousCoords: number[];
    var previousFeatureIndex = 0;
    var previousMultiIndex = 0;
    var prevGeomIndex = 0;
    if (
      coordEach(
        feature,
        function (
          currentCoord,
          coordIndex,
          featureIndexCoord,
          multiPartIndexCoord,
          geometryIndex
        ) {
          // Simulating a meta.coordReduce() since `reduce` operations cannot be stopped by returning `false`
          if (
            previousCoords === undefined ||
            featureIndex > previousFeatureIndex ||
            multiPartIndexCoord > previousMultiIndex ||
            geometryIndex > prevGeomIndex
          ) {
            previousCoords = currentCoord;
            previousFeatureIndex = featureIndex;
            previousMultiIndex = multiPartIndexCoord;
            prevGeomIndex = geometryIndex;
            segmentIndex = 0;
            return;
          }
          var currentSegment = lineString(
            [previousCoords, currentCoord],
            feature.properties
          );
          if (
            callback(
              currentSegment as Feature<LineString, P>,
              featureIndex,
              multiFeatureIndex,
              geometryIndex,
              segmentIndex
            ) === false
          )
            return false;
          segmentIndex++;
          previousCoords = currentCoord;
        }
      ) === false
    )
      return false;
  });
}

/**
 * Callback for segmentReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback segmentReduceCallback
 * @param {Reducer} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 * @returns {Reducer}
 */

/**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {segmentReduceCallback} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {Reducer} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {Reducer}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //= previousSegment
 *   //= currentSegment
 *   //= featureIndex
 *   //= multiFeatureIndex
 *   //= geometryIndex
 *   //= segmentIndex
 *   return currentSegment
 * });
 *
 * // Calculate the total number of segments
 * var initialValue = 0
 * var total = turf.segmentReduce(polygon, function (previousValue) {
 *     previousValue++;
 *     return previousValue;
 * }, initialValue);
 */
function segmentReduce<
  Reducer,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | FeatureCollection<Lines, P>
    | Feature<Lines, P>
    | Lines
    | Feature<GeometryCollection, P>
    | GeometryCollection,
  callback: (
    previousValue?: Reducer,
    currentSegment?: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    segmentIndex?: number,
    geometryIndex?: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer {
  var previousValue = initialValue;
  var started = false;
  segmentEach(
    geojson,
    function (
      currentSegment,
      featureIndex,
      multiFeatureIndex,
      geometryIndex,
      segmentIndex
    ) {
      if (started === false && initialValue === undefined)
        previousValue = currentSegment as Reducer;
      else
        previousValue = callback(
          previousValue,
          currentSegment as Feature<LineString, P>,
          featureIndex,
          multiFeatureIndex,
          geometryIndex,
          segmentIndex
        );
      started = true;
    }
  );
  return previousValue as Reducer;
}

/**
 * Callback for lineEach
 *
 * @callback lineEachCallback
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 * @returns {void | false} Return false to stop iterating
 */

/**
 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
 * similar to Array.forEach.
 *
 * @function
 * @param {FeatureCollection<Lines>|Feature<Lines>|Lines|Feature<GeometryCollection>|GeometryCollection} geojson object
 * @param {lineEachCallback} callback a method that takes (currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @returns {void}
 * @example
 * var multiLine = turf.multiLineString([
 *   [[26, 37], [35, 45]],
 *   [[36, 53], [38, 50], [41, 55]]
 * ]);
 *
 * turf.lineEach(multiLine, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function lineEach<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson:
    | FeatureCollection<Lines, P>
    | Feature<Lines, P>
    | Lines
    | Feature<GeometryCollection, P>
    | GeometryCollection,
  callback: (
    currentLine: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    geometryIndex?: number
  ) => void | false
): void {
  // validation
  if (!geojson) throw new Error("geojson is required");

  flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
    if (feature.geometry === null) return;
    var type = feature.geometry.type;
    var coords = feature.geometry.coordinates;
    switch (type) {
      case "LineString":
        if (
          callback(
            feature as Feature<LineString, P>,
            featureIndex,
            multiFeatureIndex,
            0
          ) === false
        )
          return false;
        break;
      case "Polygon":
        for (
          var geometryIndex = 0;
          geometryIndex < coords.length;
          geometryIndex++
        ) {
          if (
            callback(
              lineString(
                (coords as Polygon["coordinates"])[geometryIndex],
                feature.properties
              ),
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false
          )
            return false;
        }
        break;
    }
  });
}

/**
 * Callback for lineReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback lineReduceCallback
 * @param {Reducer} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 * @returns {Reducer}
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @function
 * @param {FeatureCollection<Lines>|Feature<Lines>|Lines|Feature<GeometryCollection>|GeometryCollection} geojson object
 * @param {Function} callback a method that takes (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @param {Reducer} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {Reducer} The value that results from the reduction.
 * @example
 * var multiPoly = turf.multiPolygon([
 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
 * ]);
 *
 * turf.lineReduce(multiPoly, function (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentLine
 * });
 */
function lineReduce<Reducer, P extends GeoJsonProperties = GeoJsonProperties>(
  geojson:
    | FeatureCollection<Lines, P>
    | Feature<Lines, P>
    | Lines
    | Feature<GeometryCollection, P>
    | GeometryCollection,
  callback: (
    previousValue?: Reducer,
    currentLine?: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    geometryIndex?: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer {
  var previousValue = initialValue;
  lineEach(
    geojson,
    function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
      if (featureIndex === 0 && initialValue === undefined)
        previousValue = currentLine as Reducer;
      else
        previousValue = callback(
          previousValue,
          currentLine,
          featureIndex,
          multiFeatureIndex,
          geometryIndex
        );
    }
  );
  return previousValue as Reducer;
}

/**
 * Finds a particular 2-vertex LineString Segment from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 * Point & MultiPoint will always return null.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.segmentIndex=0] Segment Index
 * @param {Object} [options.properties={}] Translate Properties to output LineString
 * @param {BBox} [options.bbox={}] Translate BBox to output LineString
 * @param {number|string} [options.id={}] Translate Id to output LineString
 * @returns {Feature<LineString>} 2-vertex GeoJSON Feature LineString
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findSegment(multiLine);
 * // => Feature<LineString<[[10, 10], [50, 30]]>>
 *
 * // First Segment of 2nd Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: 1});
 * // => Feature<LineString<[[-10, -10], [-50, -30]]>>
 *
 * // Last Segment of Last Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: -1, segmentIndex: -1});
 * // => Feature<LineString<[[-50, -30], [-30, -40]]>>
 */
function findSegment<
  G extends LineString | MultiLineString | Polygon | MultiPolygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson: Feature<G, P> | FeatureCollection<G, P> | G,
  options?: {
    featureIndex?: number;
    multiFeatureIndex?: number;
    geometryIndex?: number;
    segmentIndex?: number;
    properties?: P;
    bbox?: BBox;
    id?: Id;
  }
): Feature<LineString, P> {
  // Optional Parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var segmentIndex = options.segmentIndex || 0;

  // Find FeatureIndex
  var properties = options.properties;
  var geometry;

  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0)
        featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }

  // Find SegmentIndex
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
      if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
      return lineString(
        [
          (coords as LineString["coordinates"])[segmentIndex],
          (coords as LineString["coordinates"])[segmentIndex + 1],
        ],
        properties,
        options
      );
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (segmentIndex < 0)
        segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
      return lineString(
        [
          (coords as Polygon["coordinates"])[geometryIndex][segmentIndex],
          (coords as Polygon["coordinates"])[geometryIndex][segmentIndex + 1],
        ],
        properties,
        options
      );
    case "MultiLineString":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (segmentIndex < 0)
        segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
      return lineString(
        [
          (coords as MultiLineString["coordinates"])[multiFeatureIndex][
            segmentIndex
          ],
          (coords as MultiLineString["coordinates"])[multiFeatureIndex][
            segmentIndex + 1
          ],
        ],
        properties,
        options
      );
    case "MultiPolygon":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0)
        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (segmentIndex < 0)
        segmentIndex =
          (coords as MultiPolygon["coordinates"])[multiFeatureIndex][
            geometryIndex
          ].length -
          segmentIndex -
          1;
      return lineString(
        [
          (coords as MultiPolygon["coordinates"])[multiFeatureIndex][
            geometryIndex
          ][segmentIndex],
          (coords as MultiPolygon["coordinates"])[multiFeatureIndex][
            geometryIndex
          ][segmentIndex + 1],
        ],
        properties,
        options
      );
  }
  throw new Error("geojson is invalid");
}

/**
 * Finds a particular Point from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.coordIndex=0] Coord Index
 * @param {Object} [options.properties={}] Translate Properties to output Point
 * @param {BBox} [options.bbox={}] Translate BBox to output Point
 * @param {number|string} [options.id={}] Translate Id to output Point
 * @returns {Feature<Point>} 2-vertex GeoJSON Feature Point
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findPoint(multiLine);
 * // => Feature<Point<[10, 10]>>
 *
 * // First Segment of the 2nd Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: 1});
 * // => Feature<Point<[-10, -10]>>
 *
 * // Last Segment of last Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: -1, coordIndex: -1});
 * // => Feature<Point<[-30, -40]>>
 */
function findPoint<
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson: Feature<G, P> | FeatureCollection<G, P> | G,
  options?: {
    featureIndex?: number;
    multiFeatureIndex?: number;
    geometryIndex?: number;
    coordIndex?: number;
    properties?: P;
    bbox?: BBox;
    id?: Id;
  }
): Feature<Point, P> {
  // Optional Parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var coordIndex = options.coordIndex || 0;

  // Find FeatureIndex
  var properties = options.properties;
  var geometry;

  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0)
        featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }

  // Find Coord Index
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
      return point(coords, properties, options);
    case "MultiPoint":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      return point(coords[multiFeatureIndex], properties, options);
    case "LineString":
      if (coordIndex < 0) coordIndex = coords.length + coordIndex;
      return point(coords[coordIndex], properties, options);
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (coordIndex < 0)
        coordIndex = coords[geometryIndex].length + coordIndex;
      return point(coords[geometryIndex][coordIndex], properties, options);
    case "MultiLineString":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (coordIndex < 0)
        coordIndex = coords[multiFeatureIndex].length + coordIndex;
      return point(coords[multiFeatureIndex][coordIndex], properties, options);
    case "MultiPolygon":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0)
        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (coordIndex < 0)
        coordIndex =
          coords[multiFeatureIndex][geometryIndex].length - coordIndex;
      return point(
        coords[multiFeatureIndex][geometryIndex][coordIndex],
        properties,
        options
      );
  }
  throw new Error("geojson is invalid");
}

export {
  coordReduce,
  coordEach,
  propEach,
  propReduce,
  featureReduce,
  featureEach,
  coordAll,
  geomReduce,
  geomEach,
  flattenReduce,
  flattenEach,
  segmentReduce,
  segmentEach,
  lineReduce,
  lineEach,
  findSegment,
  findPoint,
};
