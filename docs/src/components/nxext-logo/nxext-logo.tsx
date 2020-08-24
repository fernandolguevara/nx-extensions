import { Component, h, Prop } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'nxext-logo'
})
export class NxextLogo {

  @Prop() inline: boolean;

  render() {
    if(this.inline) {
      return (<span class="cursor-pointer"><span class="text-brand">Nx</span><span class="text-highlight-secondary">ext</span></span>);
    } else {
      return (
        <div class="flex justify-center cursor-pointer" {...href("/")}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5" clip-rule="evenodd" viewBox="0 0 2109 2207">
            <g fill="#dd6b20" stroke-width="2.08">
              <path stroke="#bc4b00" d="M1138.61 450.174l-666.667 1333.33h440.904v109.928h-607.57l833.333-1666.67v223.404zm652.523 1081.64l180.81 361.62h-607.57v-109.928h440.904l-125.846-251.692h111.702z"/>
              <path stroke="#dd6b20" d="M1050.1 18.436l1041.67 2083.33H8.44L1050.11 18.436zm0 279.256l833.333 1666.67H216.763l833.333-1666.67z"/>
            </g>
          </svg>
          <span class="ml-3 text-3xl h-8 hidden md:inline"><span class="text-brand">Nx</span><span class="text-highlight-secondary">ext</span></span>
        </div>
      );
    }
  }
}
