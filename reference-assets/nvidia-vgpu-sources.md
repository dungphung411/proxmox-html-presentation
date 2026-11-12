# NVIDIA vGPU slide sources

Researched 10 November 2026. The slide is a conceptual sharing diagram, not a configuration screen or a capacity guarantee. Existing comparison slide changes are independent.

## Technical sources

- Proxmox announcement, 19 March 2025: official support starting with NVIDIA vGPU 18, graphics-intensive and AI-development workloads, GPU sharing between VMs. Enterprise technical support requires Basic, Standard or Premium plus an NVIDIA vGPU entitlement.
  https://www.proxmox.com/en/about/company-details/press-releases/proxmox-ve-is-an-nvidia-vgpu-supported-hypervisor
- NVIDIA generic Linux KVM release notes, including the Proxmox vendor entry and driver compatibility conditions:
  https://docs.nvidia.com/vgpu/18.0/grid-vgpu-release-notes-generic-linux-kvm/index.html
- NVIDIA supported GPU list (verify GPU and software branch for actual deployment):
  https://docs.nvidia.com/vgpu/gpus-supported-by-vgpu.html
- NVIDIA L40S product specifications explicitly list vGPU support and link to vGPU profiles. L40S is illustrative hardware, not a claim that all NVIDIA GPUs support vGPU or that every profile supports all workloads.
  https://www.nvidia.com/en-us/data-center/l40s/
- Proxmox deployment guide, linked for implementation reference; web reader returned 403 during research:
  https://pve.proxmox.com/wiki/NVIDIA_vGPU_on_Proxmox_VE

## Official image assets saved locally

All NVIDIA names and images remain the property of their respective trademark/copyright owner. Images are used as product and workload illustrations in this presentation.

- `nvidia-logo-official.png`: https://www.proxmox.com/images/proxmox/partner/nvidia-logo.png
  Source page: https://www.proxmox.com/en/partners/find-partner/all/partner/nvidia
- `nvidia-l40s-official.jpg`: https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/l40s/nvidia-l40s-hero-banner-bb580_440-d@2x.jpg
- `nvidia-3d-official.jpg`: https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/l40s/rendering-3d-graphics-fg-i3of4-d.jpg
- `nvidia-ai-official.jpg`: https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/l40s/generative-ai-fg-cc-i1of5-d.jpg

No performance multiplier, simultaneous-VM limit, or application availability guarantee is asserted. VM labels and allocation paths are conceptual HTML/SVG elements. GPU hardware, profiles, software and licensing must match the intended workloads.
