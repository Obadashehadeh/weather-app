<template>
  <div class="weather-icon" :class="[size]">
    <div
      v-if="condition === 'Sunny' || condition === 'Clear'"
      class="icon sunny"
    >
      <div class="sun">
        <div class="rays"></div>
      </div>
    </div>
    <div v-else-if="condition === 'Partly Cloudy'" class="icon partly-cloudy">
      <div class="sun"></div>
      <div class="cloud"></div>
    </div>
    <div v-else-if="condition === 'Cloudy'" class="icon cloudy">
      <div class="cloud"></div>
      <div class="cloud small"></div>
    </div>
    <div
      v-else-if="condition === 'Rainy' || condition === 'Showers'"
      class="icon rainy"
    >
      <div class="cloud"></div>
      <div class="rain"></div>
    </div>
    <div v-else class="icon default">
      <div class="cloud"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WeatherIcon",
  props: {
    condition: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "medium",
      validator: (value: string) =>
        ["small", "medium", "large"].includes(value),
    },
  },
});
</script>

<style lang="scss" scoped>
.weather-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &.small {
    transform: scale(0.6);
  }

  &.medium {
    transform: scale(1);
  }

  &.large {
    transform: scale(1.3);
  }

  .icon {
    position: relative;

    &.sunny {
      .sun {
        position: relative;
        width: 80px;
        height: 80px;
        background: #ffce54;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(255, 206, 84, 0.4);

        .rays {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;

          &:before,
          &:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            background: #ffce54;
            border-radius: 5px;
          }

          &:before {
            height: 140%;
            width: 3px;
            margin-top: -70%;
            margin-left: -1.5px;
          }

          &:after {
            width: 140%;
            height: 3px;
            margin-left: -70%;
            margin-top: -1.5px;
          }
        }
      }
    }

    &.partly-cloudy {
      .sun {
        position: absolute;
        left: 0;
        top: 5px;
        width: 60px;
        height: 60px;
        background: #ffce54;
        border-radius: 50%;
        z-index: 1;
      }

      .cloud {
        position: absolute;
        right: 0;
        top: 20px;
        width: 70px;
        height: 30px;
        background: #f5f7fa;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 2;

        &:after {
          content: "";
          position: absolute;
          left: 15px;
          top: -15px;
          width: 30px;
          height: 30px;
          background: #f5f7fa;
          border-radius: 50%;
        }

        &:before {
          content: "";
          position: absolute;
          left: 35px;
          top: -20px;
          width: 25px;
          height: 25px;
          background: #f5f7fa;
          border-radius: 50%;
        }
      }
    }

    &.cloudy {
      .cloud {
        position: relative;
        width: 80px;
        height: 40px;
        background: #f5f7fa;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        &:after {
          content: "";
          position: absolute;
          left: 15px;
          top: -20px;
          width: 35px;
          height: 35px;
          background: #f5f7fa;
          border-radius: 50%;
        }

        &:before {
          content: "";
          position: absolute;
          left: 40px;
          top: -25px;
          width: 30px;
          height: 30px;
          background: #f5f7fa;
          border-radius: 50%;
        }

        &.small {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 60px;
          height: 30px;
          opacity: 0.7;
        }
      }
    }

    &.rainy {
      height: 90px;

      .cloud {
        position: relative;
        width: 80px;
        height: 40px;
        background: #b8c2cc;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        &:after {
          content: "";
          position: absolute;
          left: 15px;
          top: -20px;
          width: 35px;
          height: 35px;
          background: #b8c2cc;
          border-radius: 50%;
        }

        &:before {
          content: "";
          position: absolute;
          left: 40px;
          top: -25px;
          width: 30px;
          height: 30px;
          background: #b8c2cc;
          border-radius: 50%;
        }
      }

      .rain {
        position: absolute;
        width: 70px;
        height: 30px;
        bottom: 0;
        left: 5px;

        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: 10px;
          width: 2px;
          height: 20px;
          background: #5d9cec;
          border-radius: 1px;
          transform: rotate(15deg);
        }

        &:before {
          content: "";
          position: absolute;
          top: 5px;
          left: 30px;
          width: 2px;
          height: 25px;
          background: #5d9cec;
          border-radius: 1px;
          transform: rotate(15deg);
        }
      }

      &:before {
        content: "";
        position: absolute;
        top: 10px;
        left: 50px;
        width: 2px;
        height: 15px;
        background: #5d9cec;
        border-radius: 1px;
        transform: rotate(15deg);
        z-index: 1;
      }
    }

    &.default {
      .cloud {
        position: relative;
        width: 80px;
        height: 40px;
        background: #f5f7fa;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        &:after {
          content: "";
          position: absolute;
          left: 15px;
          top: -20px;
          width: 35px;
          height: 35px;
          background: #f5f7fa;
          border-radius: 50%;
        }

        &:before {
          content: "";
          position: absolute;
          left: 40px;
          top: -25px;
          width: 30px;
          height: 30px;
          background: #f5f7fa;
          border-radius: 50%;
        }
      }
    }
  }
}

:deep(.dark-mode) {
  .icon {
    &.cloudy,
    &.partly-cloudy,
    &.default {
      .cloud {
        background: #4a5568;

        &:before,
        &:after {
          background: #4a5568;
        }
      }
    }

    &.rainy {
      .cloud {
        background: #2d3748;

        &:before,
        &:after {
          background: #2d3748;
        }
      }

      .rain {
        &:before,
        &:after {
          background: #90cdf4;
        }
      }

      &:before {
        background: #90cdf4;
      }
    }
  }
}
</style>
