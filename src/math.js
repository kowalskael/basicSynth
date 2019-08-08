/*
 *
 *        ______      __  ______          __
 *       / ____/___ _/ /_/ ____/___  ____/ /__
 *      / /_  / __ `/ __/ /   / __ \/ __  / _ \
 *     / __/ / /_/ / /_/ /___/ /_/ / /_/ /  __/
 *    /_/    \__,_/\__/\____/\____/\__,_/\___/
 *
 *  Copyright (c) 2018 FatCode Grzegorz Michlicki
 *
 */

export const PI = Math.PI;

/**
 * Converts value from degrees to radians.
 * @param deg
 */
export const degToRad = deg => deg * PI / 180;

/**
 * Converts value from radians to degrees.
 * @param rad
 */
export const radToDeg = rad => rad * 180 / PI;

/**
 * Clamps value between min and max
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (val, min, max) => val < min ? min : val > max ? max : val;

/**
 * Normalizes value from given range onto number between 0-1
 * @param val
 * @param min
 * @param max
 */
export const norm = (val, min, max) => (val - min) / (max - min);

/**
 * Interpolates value from number between 0-1 onto given range
 * @param val
 * @param min
 * @param max
 */
export const lerp = (val, min, max) => val * (max - min) + min;

/**
 * converts value from source range to destination range. It's equivalent to lerp(norm(val, srcMin, srcMax), destMin, destMax);
 * @param val
 * @param srcMin
 * @param srcMax
 * @param destMin
 * @param destMax
 */
export const mapRange = (val, srcMin, srcMax, destMin, destMax) =>
  (val - srcMin) / (srcMax - srcMin) * (destMax - destMin) + destMin;

