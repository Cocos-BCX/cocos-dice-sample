<template>
  <section class="slider-container">
    <div class="slider">
      <span>1</span>
      <div 
        ref="slide"
        @click="slide"
        class="slider-bg">
        <div 
          ref="range"
          :style="{'right': rangeDistance}"
          class="slider-range"></div>
        <div 
          :style="{'right': rangeDistance}"
          ref="tooltip"
          class="slider-tooltip">{{current}}</div>
        <div 
          @mousedown="dragStart"
          :class="{'active': isDraging}"
          :style="{'right': rangeDistance}"
          ref="handle"
          class="slider-handle"></div> 
      </div>
      <span>100</span>
    </div>
  </section>
</template>

<script>
import eventHub from '@/utils/event';

export default {
  props: {
    initial: {
      type: Number,
      default: 50
    }, 
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    const { offsetWidth } = this.$refs.slide;
    const { left } = this.$refs.slide.getBoundingClientRect();

    this.left = left;
    this.slideWidth = offsetWidth;
  
    document.addEventListener('mousemove', this.drag);
    document.addEventListener('mouseup', this.dragEnd);
    document.addEventListener('mouseleave', this.dragEnd);
  },
  data() {
    return {
      current: this.initial,
      isDraging: false,
      left: 0,
      slideWidth: 0
    };
  },
  computed: {
    rangeDistance() {
      return this.slideWidth - this.offsetX + 'px'; 
    }, 

    offsetX() {
      return this.current / 100 * this.slideWidth;
    }
  },
  methods: {
    slide({ offsetX }) {
      const current = Math.floor(offsetX / this.slideWidth * 100);
      switch (true) {
        case (current < this.min): 
          this.current = this.min;
          break;
        case (current > this.max):
          this.current = this.max;
          break;
        default:
          this.current = current;
      }
      eventHub.$emit('ROLLUNDER_CHANGE', this.current);
    },
    drag({ screenX, offsetX, pageX }) {
      if (!this.isDraging) return;
      this.slide({ offsetX: screenX - this.left });
    },
    dragStart() {
      this.isDraging = true;
    },
    dragEnd() {
      this.isDraging = false;
    }
  },
  destroyed() {
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseleave', this.dragEnd);
    document.removeEventListener('mouseup', this.dragEnd);
  }
};
</script>

<style scoped>
  .slider-container {
    background-color: #4b484888;
    border-radius: 50px;
    height: 84px;
    margin: 0 auto;
    width: 655px; 
    padding: 30px;
    user-select: none;
  } 

  .slider {
    position: relative;
    display: flex; 
    align-items: center;
  }

  .slider > span {
    color: #fff;
    font-weight: 600;
    padding: 0 10px;
    letter-spacing: .5px;
    font-size: 16px;
  }

  .slider-bg {
    background-color: #DE3162;
    height: 10px; 
    border-radius: 5px;
    width: 100%;
    position: relative;
    cursor: pointer;
  }

  .slider-range {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: #6EED9B;
    box-shadow: 0 0 20px #02f292;
    border-radius: 5px;
    transition: right ease 200ms;
  }

  .slider-handle {
    border: 1px solid #c5c5c5;  
    background: #f6f6f6;
    cursor: grabbing;
    width: 1.2em;
    height: 1.2em;
    position: absolute;
    z-index: 1;
    top: -.3em;
    margin-right: -.6em;
    transition: right ease 200ms;
    border-radius: 4px;
  }

  .slider-handle.active {
    background-color: #3D91E7;
  }

  .slider-tooltip {
    width: 25px;
    text-align: center;
    position: absolute;
    margin-top: -30px; 
    background: #000; 
    padding: 4px;
    border-radius: 5px;
    color: #fff;
    font-size: .8em;
    margin-right: -1em;
    transition: right ease 200ms;
  }
</style>

