export function startConfetti(): void {
  // Globals
  const random = Math.random;
  const cos = Math.cos;
  const sin = Math.sin;
  const PI = Math.PI;
  const PI2 = PI * 2;
  let timer: number | undefined = undefined;
  let frame: number | undefined = undefined;
  const confetti: Confetto[] = [];

  const spread = 40;
  const sizeMin = 3;
  const sizeMax = 12 - sizeMin;
  const eccentricity = 10;
  const deviation = 100;
  const dxThetaMin = -.1;
  const dxThetaMax = -dxThetaMin - dxThetaMin;
  const dyMin = .13;
  const dyMax = .18;
  const dThetaMin = .4;
  const dThetaMax = .7 - dThetaMin;

  type ColorThemeFunction = () => string;

  const colorThemes: ColorThemeFunction[] = [
    () => color(200 * random() | 0, 200 * random() | 0, 200 * random() | 0),
    () => {
      const black = 200 * random() | 0; return color(200, black, black);
    },
    () => {
      const black = 200 * random() | 0; return color(black, 200, black);
    },
    () => {
      const black = 200 * random() | 0; return color(black, black, 200);
    },
    () => color(200, 100, 200 * random() | 0),
    () => color(200 * random() | 0, 200, 200),
    () => {
      const black = 256 * random() | 0; return color(black, black, black);
    },
    () => colorThemes[random() < .5 ? 1 : 2](),
    () => colorThemes[random() < .5 ? 3 : 5](),
    () => colorThemes[random() < .5 ? 2 : 4]()
  ];

  function color(r: number, g: number, b: number): string {
    return `rgb(${r},${g},${b})`;
  }

  // Cosine interpolation
  function interpolation(a: number, b: number, t: number): number {
    return (1 - cos(PI * t)) / 2 * (b - a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  const radius = 1 / eccentricity, radius2 = radius + radius;
  function createPoisson(): number[] {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    const domain: number[] = [radius, 1 - radius];
    let measure = 1 - radius2;
    const spline: number[] = [0, 1];

    while (measure) {
      let dart = measure * random();
      let i: number, l: number, interval: number, a: number, b: number, c: number, d: number;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i + 1], interval = b - a;
        if (dart < measure + interval) {
          const newDart = dart + a - measure;
          spline.push(newDart);
          dart = newDart; // Update dart safely
          break;
        }
        measure += interval;
      }
      c = dart - radius, d = dart + radius;

      // Update the domain
      for (i = domain.length - 1; i > 0; i -= 2) {
        l = i - 1, a = domain[l], b = domain[i];
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2); // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      // Re-measure the domain
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i + 1] - domain[i];
    }

    return spline.sort((a, b) => a - b);
  }

  // Create the overarching container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '0';
  container.style.overflow = 'visible';
  container.style.zIndex = '9999';

  // Confetto class
  class Confetto {
    frame: number;
    outer: HTMLDivElement;
    inner: HTMLDivElement;
    axis: string;
    theta: number;
    dTheta: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    splineX: number[];
    splineY: number[];

    constructor(theme: ColorThemeFunction) {
      this.frame = 0;
      this.outer = document.createElement('div');
      this.inner = document.createElement('div');
      this.outer.appendChild(this.inner);

      const outerStyle = this.outer.style;
      const innerStyle = this.inner.style;
      outerStyle.position = 'absolute';
      outerStyle.width = (sizeMin + sizeMax * random()) + 'px';
      outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
      innerStyle.width = '100%';
      innerStyle.height = '100%';
      innerStyle.backgroundColor = theme();

      outerStyle.perspective = '50px';
      outerStyle.transform = `rotate(${360 * random()}deg)`;
      this.axis = `rotate3D(${cos(360 * random())},${cos(360 * random())},0,`;
      this.theta = 360 * random();
      this.dTheta = dThetaMin + dThetaMax * random();
      innerStyle.transform = `${this.axis}${this.theta}deg)`;

      this.x = window.innerWidth * random();
      this.y = -deviation;
      this.dx = sin(dxThetaMin + dxThetaMax * random());
      this.dy = dyMin + dyMax * random();
      outerStyle.left = `${this.x}px`;
      outerStyle.top = `${this.y}px`;

      // Create the periodic spline
      this.splineX = createPoisson();
      this.splineY = [];
      for (let i = 1, l = this.splineX.length - 1; i < l; ++i)
        this.splineY[i] = deviation * random();
      this.splineY[0] = this.splineY[this.splineX.length - 1] = deviation * random();
    }

    update(height: number, delta: number): boolean {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      const phi = this.frame % 7777 / 7777;
      let i = 0, j = 1;
      while (phi >= this.splineX[j]) i = j++;
      const rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      const phiPI = phi * PI2;

      this.outer.style.left = `${this.x + rho * cos(phiPI)}px`;
      this.outer.style.top = `${this.y + rho * sin(phiPI)}px`;
      this.inner.style.transform = `${this.axis}${this.theta}deg)`;
      return this.y > height + deviation;
    }
  }

  function poof(): void {
    if (!frame) {
      // Append the container
      document.body.appendChild(container);

      // Add confetti with random themes for better variety
      const getRandomTheme = (): ColorThemeFunction => {
        const randomIndex = Math.floor(random() * colorThemes.length);
        return colorThemes[randomIndex];
      };

      const addConfetto = () => {
        const confetto = new Confetto(getRandomTheme());
        confetti.push(confetto);
        container.appendChild(confetto.outer);
        timer = window.setTimeout(addConfetto, spread * random());
      };

      addConfetto();

      // Start the loop
      let prev: number | undefined;

      // Set a timeout to stop CREATING NEW confetti after 3 seconds
      // but allow existing ones to continue falling naturally
      const stopTimeout = window.setTimeout(() => {
        if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
      }, 3000);

      const loop = (timestamp: number) => {
        const delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        const height = window.innerHeight;

        for (let i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        // Continue the animation until all confetti are gone
        if (confetti.length > 0 || timer) {
          frame = requestAnimationFrame(loop);
        } else {
          // Only remove the container when all confetti are gone
          if (container.parentNode) {
            document.body.removeChild(container);
          }
          frame = undefined;
          clearTimeout(stopTimeout);
        }
      };

      requestAnimationFrame(loop);
    }
  }

  poof();
}
