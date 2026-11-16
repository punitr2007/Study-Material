# 📖 GATE Electronics & Communication Engineering (EC) Master Formula Handbook

A concise, high-density mathematical and conceptual formula reference across all core GATE ECE subjects.

---

## 1. Engineering Mathematics

### Linear Algebra
- **Eigenvalues & Trace/Determinant Properties:**
  $$\sum_{i=1}^n \lambda_i = \text{Trace}(A) = \sum_{i=1}^n a_{ii}, \qquad \prod_{i=1}^n \lambda_i = \det(A)$$
- **Eigenvalues of Matrix Powers & Inverse:**
  $$\text{Eigenvalues of } A^k \to \lambda^k, \qquad \text{Eigenvalues of } A^{-1} \to \frac{1}{\lambda} \quad (\text{if } \det(A) \neq 0)$$
- **Cayley-Hamilton Theorem:**
  $$\text{If Characteristic Polynomial is } P(\lambda) = \det(\lambda I - A) = 0, \quad \text{then } P(A) = 0$$
- **Rank-Nullity Theorem:**
  $$\text{Rank}(A) + \text{Nullity}(A) = n \quad (\text{number of columns of } A)$$

### Calculus & Vector Calculus
- **Mean Value Theorem (Lagrange):**
  $$f'(c) = \frac{f(b) - f(a)}{b - a}, \quad c \in (a, b)$$
- **Gradient, Divergence, Curl:**
  $$\nabla \phi = \frac{\partial \phi}{\partial x}\hat{i} + \frac{\partial \phi}{\partial y}\hat{j} + \frac{\partial \phi}{\partial z}\hat{k}$$
  $$\nabla \cdot \vec{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}$$
  $$\nabla \times \vec{F} = \begin{vmatrix} \hat{i} & \hat{j} & \hat{k} \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ F_x & F_y & F_z \end{vmatrix}$$
- **Integral Theorems:**
  - **Gauss Divergence Theorem:** $\iiint_V (\nabla \cdot \vec{F}) \, dV = \oiint_S \vec{F} \cdot d\vec{S}$
  - **Stokes' Theorem:** $\iint_S (\nabla \times \vec{F}) \cdot d\vec{S} = \oint_C \vec{F} \cdot d\vec{r}$
  - **Green's Theorem in Plane:** $\oint_C (M\,dx + N\,dy) = \iint_R \left(\frac{\partial N}{\partial x} - \frac{\partial M}{\partial y}\right) dx\,dy$

### Complex Variables
- **Cauchy-Riemann Equations:**
  $$\text{For } f(z) = u(x,y) + iv(x,y), \quad \frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \qquad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}$$
- **Cauchy Residue Theorem:**
  $$\oint_C f(z)\,dz = 2\pi i \sum \text{Res}(f, z_k)$$
  $$\text{Simple Pole at } z = z_0: \quad \text{Res}(f, z_0) = \lim_{z \to z_0} (z - z_0) f(z)$$

### Probability & Distributions
- **Bayes' Theorem:**
  $$P(A_i | B) = \frac{P(B | A_i) P(A_i)}{\sum_j P(B | A_j) P(A_j)}$$
- **Mean & Variance:**
  $$\text{Var}(X) = E[X^2] - (E[X])^2, \qquad \text{Var}(aX + b) = a^2 \text{Var}(X)$$
- **Gaussian Distribution:**
  $$f_X(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)$$
- **Poisson Distribution:**
  $$P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}, \quad E[X] = \lambda, \quad \text{Var}(X) = \lambda$$

---

## 2. Network Theory

- **Equivalent Impedance / Admittance:**
  $$Z_L(s) = sL, \quad Z_C(s) = \frac{1}{sC}$$
- **First-Order Time Constants:**
  $$\tau_{RC} = R_{th} C, \qquad \tau_{RL} = \frac{L}{R_{th}}$$
- **Transient Response (Standard Step Response):**
  $$x(t) = x(\infty) + [x(0^+) - x(\infty)] e^{-t/\tau}$$
- **Resonance in RLC Circuits:**
  - **Series RLC:** $\omega_0 = \frac{1}{\sqrt{LC}}, \quad Q = \frac{\omega_0 L}{R} = \frac{1}{R}\sqrt{\frac{L}{C}}, \quad BW = \frac{\omega_0}{Q} = \frac{R}{L}$
  - **Parallel RLC:** $\omega_0 = \frac{1}{\sqrt{LC}}, \quad Q = \frac{R}{\omega_0 L} = R\sqrt{\frac{C}{L}}, \quad BW = \frac{\omega_0}{Q} = \frac{1}{RC}$
- **Two-Port Networks:**
  $$\begin{bmatrix} V_1 \\ V_2 \end{bmatrix} = \begin{bmatrix} Z_{11} & Z_{12} \\ Z_{21} & Z_{22} \end{bmatrix} \begin{bmatrix} I_1 \\ I_2 \end{bmatrix}, \qquad \begin{bmatrix} I_1 \\ I_2 \end{bmatrix} = \begin{bmatrix} Y_{11} & Y_{12} \\ Y_{21} & Y_{22} \end{bmatrix} \begin{bmatrix} V_1 \\ V_2 \end{bmatrix}$$
  - **Symmetry Condition:** $Z_{11} = Z_{22}, \quad Y_{11} = Y_{22}, \quad A = D, \quad h_{11}h_{22} - h_{12}h_{21} = 1$
  - **Reciprocity Condition:** $Z_{12} = Z_{21}, \quad Y_{12} = Y_{21}, \quad AD - BC = 1, \quad h_{12} = -h_{21}$

---

## 3. Signals and Systems

- **Continuous-Time Fourier Transform (CTFT):**
  $$X(j\omega) = \int_{-\infty}^{\infty} x(t) e^{-j\omega t} dt, \qquad x(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega) e^{j\omega t} d\omega$$
  - Duality: $x(t) \leftrightarrow X(j\omega) \implies X(jt) \leftrightarrow 2\pi x(-\omega)$
  - Frequency Differentiation: $-j t x(t) \leftrightarrow \frac{d}{d\omega} X(j\omega)$
  - Parseval's Theorem: $\int_{-\infty}^\infty |x(t)|^2 dt = \frac{1}{2\pi} \int_{-\infty}^\infty |X(j\omega)|^2 d\omega$
- **Laplace Transform:**
  $$X(s) = \int_{-\infty}^{\infty} x(t) e^{-st} dt, \quad s = \sigma + j\omega$$
  - Initial Value Theorem: $x(0^+) = \lim_{s \to \infty} s X(s)$ (strictly proper)
  - Final Value Theorem: $x(\infty) = \lim_{s \to 0} s X(s)$ (poles of $sX(s)$ in left half plane)
- **Z-Transform:**
  $$X(z) = \sum_{n=-\infty}^{\infty} x[n] z^{-n}, \quad z = r e^{j\omega}$$
  - Stable LTI System: Unit circle ($|z| = 1$) lies entirely inside the ROC.
  - Causal LTI System: ROC extends outward from the outermost pole ($|z| > r_{max}$).
- **Sampling Theorem:**
  - Minimum Nyquist Sampling Rate: $f_s \ge 2 f_{max}$
  - Nyquist Interval: $T_s \le \frac{1}{2 f_{max}}$

---

## 4. Electronic Devices (EDC)

- **Mass Action Law:**
  $$n \cdot p = n_i^2 = N_c N_v \exp\left(-\frac{E_g}{kT}\right)$$
- **Einstein Relation:**
  $$\frac{D_n}{\mu_n} = \frac{D_p}{\mu_p} = V_t = \frac{kT}{q} \approx 25.9\text{ mV at } 300\text{ K}$$
- **Total Current Density:**
  $$J_n = q n \mu_n \mathcal{E} + q D_n \frac{dn}{dx}, \qquad J_p = q p \mu_p \mathcal{E} - q D_p \frac{dp}{dx}$$
- **PN Junction Built-in Potential ($V_{bi}$):**
  $$V_{bi} = V_t \ln\left(\frac{N_A N_D}{n_i^2}\right)$$
- **Depletion Width ($W$):**
  $$W = \sqrt{\frac{2\epsilon_s}{q}\left(\frac{1}{N_A} + \frac{1}{N_D}\right)(V_{bi} - V_A)}$$
- **Junction Capacitance (Depletion / Transition):**
  $$C_j = \frac{\epsilon_s A}{W} \propto \frac{1}{\sqrt{V_{bi} - V_A}} \quad (\text{step junction})$$
- **MOSFET Drain Current Equations:**
  - **Triode / Linear Region** ($V_{GS} \ge V_{th}, \, V_{DS} \le V_{GS} - V_{th}$):
    $$I_D = \mu_n C_{ox} \frac{W}{L} \left[(V_{GS} - V_{th})V_{DS} - \frac{V_{DS}^2}{2}\right]$$
  - **Saturation Region** ($V_{GS} \ge V_{th}, \, V_{DS} \ge V_{GS} - V_{th}$):
    $$I_D = \frac{1}{2} \mu_n C_{ox} \frac{W}{L} (V_{GS} - V_{th})^2 (1 + \lambda V_{DS})$$
  - Transconductance ($g_m$):
    $$g_m = \frac{\partial I_D}{\partial V_{GS}} = \mu_n C_{ox} \frac{W}{L}(V_{GS} - V_{th}) = \sqrt{2 \mu_n C_{ox} \frac{W}{L} I_D} = \frac{2 I_D}{V_{GS} - V_{th}}$$

---

## 5. Analog Circuits

- **BJT Small-Signal Parameters:**
  $$g_m = \frac{I_C}{V_t}, \qquad r_\pi = \frac{\beta}{g_m} = \frac{V_t}{I_B}, \qquad r_o = \frac{V_A}{I_C}$$
- **BJT Amplifier Voltage Gains (unbypassed / with $R_E$):**
  - Common Emitter: $A_v \approx -\frac{g_m R_C}{1 + g_m R_E} \approx -\frac{R_C}{r_e + R_E}$
  - Common Collector (Emitter Follower): $A_v \approx \frac{R_E}{r_e + R_E} \approx 1$
- **Miller's Theorem:**
  - Input Capacitance: $C_{in} = C_f (1 - A_v)$
  - Output Capacitance: $C_{out} = C_f \left(1 - \frac{1}{A_v}\right)$
- **Operational Amplifier Fundamentals:**
  - Inverting Configuration: $A_v = -\frac{R_f}{R_1}$
  - Non-inverting Configuration: $A_v = 1 + \frac{R_f}{R_1}$
  - Integrator: $v_o(t) = -\frac{1}{R_1 C_f} \int_0^t v_i(\tau) d\tau + v_o(0)$
  - Slew Rate: $SR = \left.\frac{dv_o}{dt}\right|_{max} = 2\pi f_{max} V_{p}$
  - Common Mode Rejection Ratio: $CMRR = \left|\frac{A_d}{A_{cm}}\right|, \quad CMRR_{dB} = 20 \log_{10} \left|\frac{A_d}{A_{cm}}\right|$

---

## 6. Digital Circuits

- **De Morgan's Laws:**
  $$\overline{A + B} = \bar{A} \cdot \bar{B}, \qquad \overline{A \cdot B} = \bar{A} + \bar{B}$$
- **Duality & Consensus Theorem:**
  $$A B + \bar{A} C + B C = A B + \bar{A} C$$
- **Flip-Flop Characteristic Equations:**
  - SR Flip-Flop: $Q_{n+1} = S + \bar{R} Q_n \quad (S \cdot R = 0)$
  - JK Flip-Flop: $Q_{n+1} = J \bar{Q}_n + \bar{K} Q_n$
  - D Flip-Flop: $Q_{n+1} = D$
  - T Flip-Flop: $Q_{n+1} = T \oplus Q_n = T \bar{Q}_n + \bar{T} Q_n$
- **Setup & Hold Time Timing Constraint:**
  $$T_{clk} \ge T_{cq(max)} + T_{comb(max)} + T_{setup}$$
  $$T_{cq(min)} + T_{comb(min)} \ge T_{hold}$$
- **Data Converters:**
  - Resolution of $n$-bit ADC/DAC: $\text{Step Size} = \frac{V_{FS}}{2^n - 1} \approx \frac{V_{FS}}{2^n}$
  - Flash ADC Comparators Required: $2^n - 1$
  - SAR Conversion Time: $n \cdot T_{clk}$ (independent of input amplitude)

---

## 7. Control Systems

- **Mason's Gain Formula:**
  $$T(s) = \frac{\sum_{k=1}^N P_k \Delta_k}{\Delta}$$
- **Second-Order System Specifications:**
  $$T(s) = \frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}$$
  - Damping factor: $\zeta = \cos\theta$
  - Peak Time: $t_p = \frac{\pi}{\omega_d} = \frac{\pi}{\omega_n \sqrt{1 - \zeta^2}}$
  - Maximum Peak Overshoot: $\%M_p = e^{-\frac{\pi \zeta}{\sqrt{1 - \zeta^2}}} \times 100\%$
  - Settling Time: $t_s \approx \frac{4}{\zeta \omega_n}$ (2% tolerance band), $\quad t_s \approx \frac{3}{\zeta \omega_n}$ (5% tolerance band)
- **Steady-State Error ($e_{ss}$):**
  $$K_p = \lim_{s \to 0} G(s)H(s), \quad K_v = \lim_{s \to 0} s G(s)H(s), \quad K_a = \lim_{s \to 0} s^2 G(s)H(s)$$
  - Step Input: $e_{ss} = \frac{1}{1 + K_p}$
  - Ramp Input: $e_{ss} = \frac{1}{K_v}$
  - Parabolic Input: $e_{ss} = \frac{1}{K_a}$
- **Nyquist Stability Criterion:**
  $$N = P - Z$$
  - $N$: Number of clockwise encirclements of $(-1 + j0)$.
  - $P$: Number of open-loop poles in RHS plane.
  - $Z$: Number of closed-loop poles in RHS plane ($Z = 0$ for stable closed loop).
- **State Space Model:**
  $$\dot{x}(t) = A x(t) + B u(t), \qquad y(t) = C x(t) + D u(t)$$
  $$\text{Transfer Function } G(s) = C(sI - A)^{-1}B + D$$
  - Controllability Matrix: $Q_c = [B \quad AB \quad A^2 B \quad \dots \quad A^{n-1}B] \implies \text{Rank}(Q_c) = n$
  - Observability Matrix: $Q_o = [C^T \quad A^T C^T \quad \dots \quad (A^T)^{n-1} C^T] \implies \text{Rank}(Q_o) = n$

---

## 8. Communication Systems

- **Modulation Index & Power in AM:**
  $$\mu = \frac{A_m}{A_c}, \qquad P_t = P_c \left(1 + \frac{\mu^2}{2}\right)$$
  $$\text{Efficiency } \eta = \frac{P_{sidebands}}{P_t} = \frac{\mu^2}{2 + \mu^2}$$
- **Angle Modulation (Carson's Rule Bandwidth):**
  $$\beta = \frac{\Delta f}{f_m} = \frac{k_f A_m}{f_m}, \qquad BW = 2(\Delta f + f_m) = 2 f_m (1 + \beta)$$
- **Quantization Noise & SQNR in PCM:**
  $$\sigma_q^2 = \frac{\Delta^2}{12} = \frac{V_{pp}^2}{12 \cdot 2^{2n}}$$
  $$SQNR_{dB} = 1.76 + 6.02 n \text{ dB (for full-scale sinusoidal input)}$$
- **Channel Capacity (Shannon-Hartley Theorem):**
  $$C = B \log_2 \left(1 + \frac{S}{N}\right) = B \log_2 (1 + SNR) \text{ bits/sec}$$
  $$\lim_{B \to \infty} C = \frac{S}{N_0} \log_2 e \approx 1.44 \frac{S}{N_0}$$
- **Bit Error Probability ($P_e$ with AWGN):**
  - BPSK: $P_e = Q\left(\sqrt{\frac{2E_b}{N_0}}\right)$
  - BFSK (Coherent): $P_e = Q\left(\sqrt{\frac{E_b}{N_0}}\right)$
  - BASK (Coherent): $P_e = Q\left(\sqrt{\frac{E_b}{2N_0}}\right)$
  - QPSK: $P_b = Q\left(\sqrt{\frac{2E_b}{N_0}}\right)$ (same bit error rate as BPSK, half bandwidth)

---

## 9. Electromagnetics (EMT)

- **Maxwell's Equations:**
  $$\nabla \cdot \vec{D} = \rho_v, \qquad \nabla \cdot \vec{B} = 0$$
  $$\nabla \times \vec{E} = -\frac{\partial \vec{B}}{\partial t}, \qquad \nabla \times \vec{H} = \vec{J} + \frac{\partial \vec{D}}{\partial t}$$
- **Uniform Plane Waves:**
  $$\gamma = \alpha + j\beta = \sqrt{j\omega\mu (\sigma + j\omega\epsilon)}$$
  - Intrinsic Impedance: $\eta = \sqrt{\frac{j\omega\mu}{\sigma + j\omega\epsilon}}$
  - Lossless Media ($\sigma = 0$): $\alpha = 0, \quad \beta = \omega\sqrt{\mu\epsilon}, \quad \eta = \sqrt{\frac{\mu}{\epsilon}}$
  - Good Conductors ($\sigma \gg \omega\epsilon$): $\alpha = \beta = \sqrt{\frac{\omega\mu\sigma}{2}} = \frac{1}{\delta}, \quad \delta = \sqrt{\frac{2}{\omega\mu\sigma}}$
- **Poynting Vector & Average Power:**
  $$\vec{S} = \vec{E} \times \vec{H}, \qquad \vec{P}_{avg} = \frac{1}{2} \text{Re}[\vec{E} \times \vec{H}^*] = \frac{|\vec{E}_0|^2}{2|\eta|} \cos\theta_\eta \hat{a}_k$$
- **Transmission Line Equations:**
  $$Z_0 = \sqrt{\frac{R + j\omega L}{G + j\omega C}} \approx \sqrt{\frac{L}{C}} \quad (\text{lossless})$$
  $$\Gamma_L = \frac{Z_L - Z_0}{Z_L + Z_0}, \qquad VSWR = s = \frac{1 + |\Gamma_L|}{1 - |\Gamma_L|}$$
  $$Z_{in}(l) = Z_0 \left[\frac{Z_L + j Z_0 \tan(\beta l)}{Z_0 + j Z_L \tan(\beta l)}\right]$$
  - Quarter-Wave Transformer ($l = \lambda/4$): $Z_{in} = \frac{Z_0^2}{Z_L}$
  - Half-Wave Line ($l = \lambda/2$): $Z_{in} = Z_L$
- **Rectangular Waveguides ($a > b$):**
  - Cutoff Frequency ($TE_{mn} / TM_{mn}$): $f_c = \frac{c}{2} \sqrt{\left(\frac{m}{a}\right)^2 + \left(\frac{n}{b}\right)^2}$
  - Dominant Mode: $TE_{10} \implies f_c = \frac{c}{2a}$
  - Phase velocity & Group velocity relation: $v_p \cdot v_g = c^2, \quad v_p = \frac{c}{\sqrt{1 - (f_c/f)^2}} > c, \quad v_g = c\sqrt{1 - (f_c/f)^2} < c$
- **Antenna Fundamentals:**
  - Radiation Resistance of Half-Wave Dipole: $R_{rad} \approx 73 \, \Omega$
  - Directivity of Half-Wave Dipole: $D \approx 1.64 \approx 2.15\text{ dBi}$
  - Friis Transmission Formula: $\frac{P_r}{P_t} = G_t G_r \left(\frac{\lambda}{4\pi R}\right)^2$

