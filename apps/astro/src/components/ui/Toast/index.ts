let timeoutId: ReturnType<typeof setTimeout> | undefined
let startTime: number
let remainingTime = 0
const duration = 8000
const toast = document.querySelector<HTMLDivElement>('.toast')!
const toastMessage = toast.querySelector('.toast-message')!

export function showToast(message: string) {
  toastMessage.textContent = message
  toast.setAttribute('aria-hidden', 'true')
  toast.offsetWidth
  toast.setAttribute('aria-hidden', 'false')
  startTime = Date.now()
  remainingTime = duration
  scheduleHideToast()
}

function pauseToast() {
  clearTimeout(timeoutId)
  remainingTime -= Date.now() - startTime
}

function resumeToast() {
  startTime = Date.now()
  scheduleHideToast()
}

function scheduleHideToast() {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    toast.setAttribute('aria-hidden', 'true')
  }, remainingTime)
}

toast.addEventListener('mouseenter', pauseToast)
toast.addEventListener('mouseleave', resumeToast)
