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

export const degToRad = deg => deg * PI / 180;

export const radToDeg = rad => rad * 180 / PI;

export const clamp = (val, min, max) => val < min ? min : val > max ? max : val;

export const norm = (val, min, max) => (val - min) / (max - min);

export const lerp = (val, min, max) => val * (max - min) + min;

export const mapRange = (val, srcMin, srcMax, destMin, destMax) =>
  (val - srcMin) / (srcMax - srcMin) * (destMax - destMin) + destMin;

