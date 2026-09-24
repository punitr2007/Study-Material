# ⚡ Microelectronics Circuits & Applications (EAEPC304) — Master Study & Practice Guide
## Direct Mapping to Sedra & Smith, Behzad Razavi & Mid-Semester Question Vault

> **Course**: EAEPC304 — Microelectronics Circuits and Applications  
> **Scheme**: B.Tech ECE / ECAM Scheme (NSUT)  
> **Primary References**: 
> 1. Adel S. Sedra & Kenneth C. Smith — *Microelectronic Circuits* (7th/8th Edition)
> 2. Behzad Razavi — *Fundamentals of Microelectronics* & *Design of Analog CMOS Integrated Circuits*

---

## 🎯 Executive Exam Blueprint & Textbook Source Code

Every major numerical and derivation across your mid-semester and end-semester question papers is adapted directly from **Sedra & Smith** worked examples and **Razavi** end-of-chapter problems:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │          EAEPC304 EXAM QUESTION PATTERNS                │
                  └────────────────────────────┬────────────────────────────┘
                                               │
         ┌─────────────────────────────────────┴────────────────────────────────────┐
         ▼                                                                          ▼
┌──────────────────────────────────────────┐               ┌──────────────────────────────────────────┐
│      Unit 1: Biasing & Frequency         │               │     Unit 2: Differential & Multi-Stage   │
├──────────────────────────────────────────┤               ├──────────────────────────────────────────┤
│ • Sedra Ch 1: Power efficiency (P_dc, η) │               │ • Sedra Ch 9: Differential Pair Steering │
│ • Sedra Ch 5/6: MOSFET & BJT DC Biasing  │               │ • Sedra Ch 9: Half-Circuit Analysis (Ad) │
│ • Sedra Ch 8: Wilson & Cascode Mirrors   │               │ • Sedra Ch 9: Common-Mode Gain & CMRR    │
│ • Sedra Ch 10: Miller Theorem & f_H, f_T │               │ • Sedra Ch 8: Cascode Stage Resistance   │
│ • Sedra Ch 10: SCTC Method for f_L       │               │ • Sedra Ch 9: Darlington Configuration   │
└──────────────────────────────────────────┘               └──────────────────────────────────────────┘
```

---

## 📘 Unit-by-Unit Deep Dive & Question Templates

### 🔵 Unit 1: Frequency Response & Biasing Techniques

#### 1. Amplifier Efficiency & Power Dissipation (Sedra & Smith Ch 1)
* **Core Formulas**:
  $$\begin{aligned}
  P_{\text{dc}} &= V_{CC}I_{CC} + V_{EE}I_{EE} \\
  P_L &= \frac{1}{2} \frac{V_o^2}{R_L} = \frac{V_{o,\text{rms}}^2}{R_L} \\
  P_{\text{diss}} &= P_{\text{dc}} + P_I - P_L \\
  \eta &= \frac{P_L}{P_{\text{dc}}} \times 100\%
  \end{aligned}$$
* **Exam Template (Mid-Sem 2025 Q1)**: Given sinusoidal input amplitude, supply voltages, and load resistance $R_L$, calculate the DC supply power drawn, signal power delivered to the load, power dissipated in the amplifier device, and overall power conversion efficiency $\eta$.

#### 2. MOSFET & BJT DC Biasing Design (Sedra & Smith Ch 5 & Ch 6)
* **MOSFET Saturation Current**:
  $$I_D = \frac{1}{2} k_n' \frac{W}{L} (V_{GS} - V_{tn})^2 (1 + \lambda V_{DS})$$
* **Transconductance & Output Resistance**:
  $$g_m = \sqrt{2 k_n' \frac{W}{L} I_D} = \frac{2 I_D}{V_{OV}} = \frac{I_D}{V_t}, \quad r_o = \frac{V_A}{I_D} = \frac{1}{\lambda I_D}$$
* **Exam Template (Mid-Sem 2025 Q3b, Q5b)**: Design a four-resistor bias network for a specified $I_D$ and $V_{DS}$, ensuring the MOSFET remains safely in saturation ($V_{DS} \ge V_{GS} - V_{tn}$).

#### 3. Current Mirrors & Compliance Voltage (Sedra & Smith Ch 8 / Razavi Ch 9)
* **Wilson Current Mirror**: Output resistance $R_o \approx \frac{\beta r_o}{2}$ (BJT) or $g_m r_o^2$ (MOS).
* **Cascode Current Mirror**: Output resistance $R_o \approx g_{m2} r_{o2} r_{o1}$.
* **Compliance / Minimum Output Voltage**: $V_{o,\min} = 2V_{OV} = 2(V_{GS} - V_{tn})$ for Cascode MOS mirrors.

#### 4. High-Frequency Response & Miller Theorem (Sedra & Smith Ch 10)
* **Unity-Gain Frequency**:
  $$f_T = \frac{g_m}{2\pi(C_{gs} + C_{gd})}$$
* **Miller Equivalent Input Capacitance**:
  $$C_{\text{in}} = C_{gs} + C_{gd}(1 - A_v) = C_{gs} + C_{gd}(1 + g_m R_L')$$
* **Dominant Upper 3-dB Frequency $f_H$**:
  $$f_H \approx \frac{1}{2\pi R_{\text{sig}}' C_{\text{in}}}$$

#### 5. Low-Frequency Response via SCTC Method (Sedra & Smith Section 10.3)
* **Short-Circuit Time Constant Formula**:
  $$f_L \approx \frac{1}{2\pi} \sum_{i} \frac{1}{R_{is} C_i} = \frac{1}{2\pi} \left( \frac{1}{R_{C1s}C_{C1}} + \frac{1}{R_{C2s}C_{C2}} + \frac{1}{R_{Es}C_E} \right)$$
* Where $R_{is}$ is the Thevenin resistance seen across terminals of capacitor $C_i$ with all other capacitors replaced by short circuits and independent signal sources turned off.

---

### 🟢 Unit 2: Multi-Stage & Differential Amplifiers

#### 1. MOS & BJT Differential Pair Steering (Sedra & Smith Ch 9)
* **Large-Signal Current Transfer**:
  $$i_{D1} = \frac{I}{2} + \frac{I}{2} \left( \frac{v_{id}}{V_{OV}} \right) \sqrt{2 - \left(\frac{v_{id}}{V_{OV}}\right)^2}$$
* **Maximum Linear Range**: $|v_{id}| \le \sqrt{2} V_{OV}$.
* **Complete Current Steering Condition**: Complete steering to one transistor occurs when $|v_{id}| = \sqrt{2} V_{OV}$.

#### 2. Small-Signal Differential & Common-Mode Gain
* **Differential Gain (Half-Circuit)**:
  $$A_d = \frac{v_{od}}{v_{id}} = -g_m (R_D \parallel r_o) \quad \text{or} \quad -g_m R_C$$
* **Common-Mode Gain**:
  $$A_{cm} = \frac{v_{ocm}}{v_{icm}} \approx -\frac{g_m R_D}{1 + 2 g_m R_{SS}} \approx -\frac{R_D}{2 R_{SS}}$$
* **Common-Mode Rejection Ratio (CMRR)**:
  $$\text{CMRR} = \left| \frac{A_d}{A_{cm}} \right| \approx 2 g_m R_{SS} \implies \text{CMRR}_{\text{dB}} = 20 \log_{10} \left| \frac{A_d}{A_{cm}} \right|$$

#### 3. Cascode & Darlington Configurations (Sedra Ch 8 & Ch 9)
* **Cascode Stage Voltage Gain**: $A_v \approx -g_{m1} (R_{o,\text{cascode}} \parallel R_L) \approx -g_{m1} (g_{m2} r_{o2} r_{o1})$.
* **Darlington Pair**: Composite current gain $\beta \approx \beta_1 \cdot \beta_2$, input resistance $R_{\text{in}} \approx r_{\pi 1} + (1 + \beta_1) r_{\pi 2}$.

---

## 📂 Curated Materials in This Repository

All key solutions, lecture slide series, and homework banks are organized in:
`03_Microelectronics_Circuits_and_Applications_EAEPC304/Practice_and_Reference_Material/`

| Directory | Contents | Highlights |
| :--- | :--- | :--- |
| **`01_Sedra_and_Smith_Solutions_and_Manuals`** | `Sedra_and_Smith_Microelectronic_Circuits_Complete_Solutions_Manual.pdf` | Full worked solutions for Chapters 1 through 17 |
| **`02_Sedra_Smith_LaTeX_Detailed_Notes`** | `Sedra_Smith_Microelectronic_Circuits_LaTeX_Notes_Ch3_to_Ch6.pdf` | Kevin Wang's LaTeX derivations for BJT & MOSFET DC/AC |
| **`03_Analog_Design_Basics_Guides`** | 8 Markdown guides (`1_Analog_Design_Basics.md` to `8_Analog_IC_Layout_Basics.md`) | Current mirrors, cascodes, diff pairs, frequency response, PLLs, ADCs, LDOs |
| **`04_ECE321_Exam_and_Homework_Sets`** | 28 Lecture Slides, 12 Problem Sets with Full Solutions, 4 Midterms/Finals | University-level exam questions matching NSUT mid-sem patterns |
| **`05_Open_Source_Electrical_Engineering`** | `OSEE_Analog_Electronics_Curriculum.md` | Curated problem bank and textbook index |

---

## 🏛️ Cloned Full Reference Vaults (Local Cache)

The comprehensive upstream repositories are cached at:
`/home/punit/Local_Codebase/Projects/Extracted_Contents/microelectronics_materials/`

1. `unm-ieee/ECE_Material`: Full university ECE archive with ECE321 (Electronics I) & ECE322 (Electronics II) test archives.
2. `muhammadaldacher/muhammadaldacher`: Industry-standard analog design interview questions and architectural breakdowns.
3. `Artoriuz/OSEE`: Open-Source Electrical Engineering curriculum.
4. `kwangzera-archive/sedra-smith-microelectronic-circuits-notes`: LaTeX source code and schematics for Sedra & Smith.
