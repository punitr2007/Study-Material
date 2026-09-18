import json
import hashlib
from pathlib import Path

def compute_q_hash(question_text: str) -> str:
    normalized = " ".join(question_text.lower().split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()[:12]

sol_dict = {}

# -------------------------------------------------------------
# SUBJECT 1: Signals and Systems (EAEPC302)
# -------------------------------------------------------------
sol_dict["01_Signals_and_Systems_EAEPC302"] = [
    {
      "question_id": "SS_2025_MID_Q1A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC302",
      "unit": 1,
      "topic": "Properties of Systems",
      "question": "Determine whether the following discrete-time system is: (i) Causal, (ii) Linear. System equation: $$y[n] = x[n] \\cdot x[n-2]$$",
      "marks": 2,
      "reference": "Oppenheim & Willsky (2nd Ed), Chapter 1 (Signals and Systems)",
      "solution_markdown": """### **Step-by-Step Solution**

Given the discrete-time system relationship:
$$y[n] = x[n] \\cdot x[n-2]$$

---

#### **Part (i): Causality Analysis**
1. **Definition of Causality:** A discrete-time system is causal if the output at any index $n = n_0$, $y[n_0]$, depends only on current input $x[n_0]$ and/or past inputs $x[n]$ ($n < n_0$), and is independent of future inputs.
2. **Evaluation:** For any index $n$, the output $y[n]$ depends strictly on:
   - Current input: $x[n]$
   - Past input (delayed by 2 units): $x[n-2]$
3. Since there is no dependence on future inputs $x[n+k]$ for $k > 0$:
$$\\mathbf{\\text{The system is CAUSAL.}}$$

---

#### **Part (ii): Linearity Analysis**
1. **Superposition Principle:** For a system $\\mathcal{T}$, it is linear if and only if:
$$\\mathcal{T}\\{a x_1[n] + b x_2[n]\\} = a \\mathcal{T}\\{x_1[n]\\} + b \\mathcal{T}\\{x_2[n]\\}$$
2. Let input $x_3[n] = a x_1[n] + b x_2[n]$.
   The resulting output is:
   $$y_3[n] = x_3[n] \\cdot x_3[n-2] = \\big(a x_1[n] + b x_2[n]\\big)\\big(a x_1[n-2] + b x_2[n-2]\\big)$$
   $$y_3[n] = a^2 x_1[n]x_1[n-2] + b^2 x_2[n]x_2[n-2] + ab\\big(x_1[n]x_2[n-2] + x_2[n]x_1[n-2]\\big)$$
3. The linear combination of individual responses is:
   $$y_{comb}[n] = a y_1[n] + b y_2[n] = a x_1[n]x_1[n-2] + b x_2[n]x_2[n-2]$$
4. Since $y_3[n] \\neq y_{comb}[n]$ due to the cross-product terms $ab(x_1[n]x_2[n-2] + x_2[n]x_1[n-2])$:
$$\\mathbf{\\text{The system is NON-LINEAR.}}$$"""
    },
    {
      "question_id": "SS_2025_MID_Q1B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC302",
      "unit": 1,
      "topic": "Properties of Systems",
      "question": "Determine whether the following continuous-time system is: (i) Memoryless, (ii) Time-Invariant. System equation: $$y(t) = t \\cdot e^{x(t)}$$",
      "marks": 2,
      "reference": "Oppenheim & Willsky (2nd Ed), Chapter 1",
      "solution_markdown": """### **Step-by-Step Solution**

Given the continuous-time system relationship:
$$y(t) = t \\cdot e^{x(t)}$$

---

#### **Part (i): Memoryless (Static vs Dynamic) Analysis**
1. **Definition:** A system is memoryless if the output $y(t)$ at any specific time $t = t_0$ depends strictly on the input value $x(t_0)$ at that identical instantaneous time instant $t_0$, and does not require past or future input values.
2. **Evaluation:** At any arbitrary time $t_0$, $y(t_0) = t_0 e^{x(t_0)}$, which requires only the current value $x(t_0)$.
$$\\mathbf{\\text{The system is MEMORYLESS (Static).}}$$

---

#### **Part (ii): Time-Invariance Analysis**
1. **Definition:** A system is time-invariant if a time shift in the input by $t_0$ produces an identical time shift in the output: $\\mathcal{T}\\{x(t - t_0)\\} = y(t - t_0)$.
2. **Shifted Input Response:** Let input $x_1(t) = x(t - t_0)$. The response is:
   $$y_1(t) = t \\cdot e^{x_1(t)} = t \\cdot e^{x(t - t_0)}$$
3. **Delayed Output:** Shifting the original output $y(t)$ by $t_0$ gives:
   $$y(t - t_0) = (t - t_0) \\cdot e^{x(t - t_0)}$$
4. Comparing the two expressions:
   $$y_1(t) = t e^{x(t - t_0)} \\neq (t - t_0) e^{x(t - t_0)} = y(t - t_0)$$
   Because the explicit multiplying factor $t$ is time-dependent:
$$\\mathbf{\\text{The system is TIME-VARIANT (Time-Varying).}}$$"""
    },
    {
      "question_id": "SS_2025_MID_Q2",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC302",
      "unit": 1,
      "topic": "Signal Transformations",
      "question": "A discrete-time signal $x[n]$ is given by: $$x[n] = \\{1, 0, 1, 2, 3\\} \\quad \\text{with origin at } n=0 \\text{ as } x[0]=1$$ (a) Sketch and express $y[n] = x[n-2]$\n(b) Sketch and express $y[n] = x[-n/2]$",
      "marks": 2.5,
      "reference": "Oppenheim & Willsky, Chapter 1 (Signal Operations)",
      "solution_markdown": """### **Step-by-Step Solution**

Given the sequence $x[n]$:
$$x[-2]=1, \\quad x[-1]=0, \\quad x[0]=1, \\quad x[1]=2, \\quad x[2]=3$$

---

#### **Part (a): Time Delay $y[n] = x[n-2]$**
1. **Operation:** Time-shifting to the right (delay) by 2 samples.
   $$n_{new} = n_{old} + 2$$
2. **Sample values:**
   - For $n = 0: y[0] = x[-2] = 1$
   - For $n = 1: y[1] = x[-1] = 0$
   - For $n = 2: y[2] = x[0] = 1$
   - For $n = 3: y[3] = x[1] = 2$
   - For $n = 4: y[4] = x[2] = 3$
3. **Resulting Sequence:**
$$y[n] = \\{1, 0, 1, 2, 3\\} \\quad \\text{for } n \\in [0, 4], \\quad \\text{with } y[0]=1$$

---

#### **Part (b): Time Scaling and Inversion $y[n] = x[-n/2]$**
1. **Operation:** Time-reversal followed by time-expansion (interpolation).
   $y[n] = x[-n/2]$ is defined only when $-n/2$ is an integer (i.e., $n$ is an even integer).
2. **Sample values:**
   - $n = -4 \\implies -n/2 = 2 \\implies y[-4] = x[2] = 3$
   - $n = -2 \\implies -n/2 = 1 \\implies y[-2] = x[1] = 2$
   - $n = 0 \\implies -n/2 = 0 \\implies y[0] = x[0] = 1$
   - $n = 2 \\implies -n/2 = -1 \\implies y[2] = x[-1] = 0$
   - $n = 4 \\implies -n/2 = -2 \\implies y[4] = x[-2] = 1$
   - For all odd indices ($n = \\pm 1, \\pm 3, \\dots$), $y[n] = 0$ (or undefined in standard continuous scaling).
3. **Resulting Sequence:**
$$y[n] = \\{\\dots, 3, 0, 2, 0, \\mathbf{1}, 0, 0, 0, 1, \\dots\\}$$"""
    },
    {
      "question_id": "SS_2025_MID_Q3",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC302",
      "unit": 1,
      "topic": "Even and Odd Signals",
      "question": "Show that the product of two even signals or of two odd signals is an even signal, and that the product of an even and an odd signal is an odd signal.",
      "marks": 2,
      "reference": "Oppenheim & Willsky (2nd Ed), Chapter 1, Section 1.2",
      "solution_markdown": """### **Step-by-Step Proof**

#### **Definitions:**
- A signal $g(t)$ is **Even** if $g(-t) = g(t)$ for all $t$.
- A signal $g(t)$ is **Odd** if $g(-t) = -g(t)$ for all $t$.

---

#### **Case 1: Product of Two Even Signals**
Let $x_1(t)$ and $x_2(t)$ both be even signals:
$$x_1(-t) = x_1(t) \\quad \\text{and} \\quad x_2(-t) = x_2(t)$$
Define the product signal $y(t) = x_1(t) \\cdot x_2(t)$.
Evaluate $y(-t)$:
$$y(-t) = x_1(-t) \\cdot x_2(-t) = \\big(x_1(t)\\big) \\cdot \\big(x_2(t)\\big) = x_1(t) \\cdot x_2(t) = y(t)$$
$$\\therefore \\mathbf{y(t) \\text{ is an EVEN signal.}}$$

---

#### **Case 2: Product of Two Odd Signals**
Let $x_1(t)$ and $x_2(t)$ both be odd signals:
$$x_1(-t) = -x_1(t) \\quad \\text{and} \\quad x_2(-t) = -x_2(t)$$
Define $y(t) = x_1(t) \\cdot x_2(t)$.
Evaluate $y(-t)$:
$$y(-t) = x_1(-t) \\cdot x_2(-t) = \\big(-x_1(t)\\big) \\cdot \\big(-x_2(t)\\big) = (-1)(-1) \\big(x_1(t) \\cdot x_2(t)\\big) = y(t)$$
$$\\therefore \\mathbf{y(t) \\text{ is an EVEN signal.}}$$

---

#### **Case 3: Product of an Even Signal and an Odd Signal**
Let $x_e(t)$ be even ($x_e(-t) = x_e(t)$) and $x_o(t)$ be odd ($x_o(-t) = -x_o(t)$).
Define $y(t) = x_e(t) \\cdot x_o(t)$.
Evaluate $y(-t)$:
$$y(-t) = x_e(-t) \\cdot x_o(-t) = \\big(x_e(t)\\big) \\cdot \\big(-x_o(t)\\big) = -\\big(x_e(t) \\cdot x_o(t)\\big) = -y(t)$$
$$\\therefore \\mathbf{y(t) \\text{ is an ODD signal.}}$$"""
    },
    {
      "question_id": "SS_2025_MID_Q4",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC302",
      "unit": 2,
      "topic": "Discrete-Time Convolution",
      "question": "Perform discrete-time convolution of the sequence $x[n] = \\{1, 2, 3, 4\\}$ with the impulse response $$h[n] = 2\\delta[n] + \\delta[n-1]$$",
      "marks": 2,
      "reference": "Oppenheim & Willsky (2nd Ed), Chapter 2 (LTI Systems)",
      "solution_markdown": """### **Step-by-Step Solution**

Given the discrete-time signals:
$$x[n] = \\{1, 2, 3, 4\\} \\quad \\text{for } n = 0, 1, 2, 3$$
$$h[n] = 2\\delta[n] + \\delta[n-1] = \\{2, 1\\} \\quad \\text{for } n = 0, 1$$

---

#### **Method 1: Distributive Property of Convolution**
The convolution of any signal with an impulse $\\delta[n - n_0]$ yields a delayed signal:
$$x[n] * \\delta[n - n_0] = x[n - n_0]$$
Using linearity and distributivity of convolution:
$$y[n] = x[n] * h[n] = x[n] * \\big(2\\delta[n] + \\delta[n-1]\\big) = 2 x[n] + x[n-1]$$

---

#### **Method 2: Sample-by-Sample Tabular Computation**
Let length of $x[n]$ be $L_1 = 4$ ($n \\in [0, 3]$) and $h[n]$ be $L_2 = 2$ ($n \\in [0, 1]$).
Total length of $y[n] = L_1 + L_2 - 1 = 4 + 2 - 1 = 5$, spanning $n \\in [0, 4]$.

- **For $n = 0$:** $y[0] = 2x[0] + x[-1] = 2(1) + 0 = \\mathbf{2}$
- **For $n = 1$:** $y[1] = 2x[1] + x[0] = 2(2) + 1 = 4 + 1 = \\mathbf{5}$
- **For $n = 2$:** $y[2] = 2x[2] + x[1] = 2(3) + 2 = 6 + 2 = \\mathbf{8}$
- **For $n = 3$:** $y[3] = 2x[3] + x[2] = 2(4) + 3 = 8 + 3 = \\mathbf{11}$
- **For $n = 4$:** $y[4] = 2x[4] + x[3] = 2(0) + 4 = \\mathbf{4}$

$$\\mathbf{y[n] = \\{2, 5, 8, 11, 4\\} \\quad \\text{for } n = 0, 1, 2, 3, 4}$$"""
    },
    {
      "question_id": "SS_2025_MID_Q5A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC302",
      "unit": 2,
      "topic": "LTI Impulse Response Properties",
      "question": "For a continuous-time LTI system with impulse response $h(t)$, state the necessary and sufficient conditions on $h(t)$ for the system to be: (i) Memoryless, (ii) BIBO Stable.",
      "marks": 2,
      "reference": "Oppenheim & Willsky (2nd Ed), Chapter 2",
      "solution_markdown": """### **Step-by-Step Solution**

#### **(i) Condition for Memoryless (Static) LTI System:**
1. **Statement:** A continuous-time LTI system is memoryless if and only if its impulse response $h(t)$ is an impulse at $t = 0$:
$$h(t) = K \\cdot \\delta(t)$$
where $K$ is a constant gain factor.
2. **Proof:** The convolution integral gives:
$$y(t) = \\int_{-\\infty}^{\\infty} h(\\tau) x(t - \\tau) d\\tau = \\int_{-\\infty}^{\\infty} K \\delta(\\tau) x(t - \\tau) d\\tau = K x(t)$$
The output depends solely on the current input $x(t)$ at the exact instant $t$.

---

#### **(ii) Condition for Bounded-Input Bounded-Output (BIBO) Stability:**
1. **Statement:** A continuous-time LTI system is BIBO stable if and only if its impulse response is **absolutely integrable**:
$$\\int_{-\\infty}^{\\infty} |h(t)| \\, dt < \\infty$$
2. **Proof:** If input $|x(t)| \\le M_x < \\infty$ for all $t$:
$$|y(t)| = \\left|\\int_{-\\infty}^{\\infty} h(\\tau) x(t - \\tau) d\\tau\\right| \\le \\int_{-\\infty}^{\\infty} |h(\\tau)| |x(t - \\tau)| d\\tau \\le M_x \\int_{-\\infty}^{\\infty} |h(\\tau)| d\\tau$$
Thus, $|y(t)| \\le M_y < \\infty$ if and only if $\\int_{-\\infty}^{\\infty} |h(t)| dt < \\infty$."""
    },
    {
      "question_id": "SS_2025_MID_Q5B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC302",
      "unit": 2,
      "topic": "Continuous-Time Convolution Integral",
      "question": "Evaluate the convolution $y(t) = x(t) * h(t)$ where $$x(t) = u(t) - u(t-2) \\quad \\text{and} \\quad h(t) = e^{-2t}u(t)$$ Sketch the output waveform $y(t)$.",
      "marks": 2,
      "reference": "Oppenheim & Willsky (2nd Ed), Chapter 2, Section 2.2",
      "solution_markdown": """### **Step-by-Step Solution**

The convolution integral is given by:
$$y(t) = \\int_{-\\infty}^{\\infty} x(\\tau) h(t - \\tau) d\\tau$$
Given:
$$x(\\tau) = \\begin{cases} 1, & 0 \\le \\tau \\le 2 \\\\ 0, & \\text{otherwise} \\end{cases} \\qquad h(t - \\tau) = e^{-2(t - \\tau)} u(t - \\tau)$$

---

#### **Region 1: $t < 0$ (No overlap)**
$$y(t) = 0$$

---

#### **Region 2: $0 \\le t < 2$ (Partial Overlap)**
The limits of integration are $\\tau = 0$ to $\\tau = t$:
$$y(t) = \\int_{0}^{t} (1) \\cdot e^{-2(t - \\tau)} d\\tau = e^{-2t} \\int_{0}^{t} e^{2\\tau} d\\tau = e^{-2t} \\left[ \\frac{e^{2\\tau}}{2} \\right]_0^t = \\frac{e^{-2t}}{2} (e^{2t} - 1) = \\mathbf{\\frac{1 - e^{-2t}}{2}}$$

---

#### **Region 3: $t \\ge 2$ (Complete Overlap)**
The limits of integration are $\\tau = 0$ to $\\tau = 2$:
$$y(t) = \\int_{0}^{2} (1) \\cdot e^{-2(t - \\tau)} d\\tau = e^{-2t} \\left[ \\frac{e^{2\\tau}}{2} \\right]_0^2 = e^{-2t} \\left( \\frac{e^4 - 1}{2} \\right) = \\mathbf{\\frac{e^4 - 1}{2} e^{-2t}}$$

---

#### **Summary Output Function:**
$$y(t) = \\begin{cases} 0, & t < 0 \\\\[6pt] \\dfrac{1 - e^{-2t}}{2}, & 0 \\le t < 2 \\\\[6pt] \\dfrac{e^4 - 1}{2} e^{-2t}, & t \\ge 2 \\end{cases}$$"""
    }
]

print("Subject 1 loaded")

# -------------------------------------------------------------
# SUBJECT 2: Probability Theory and Random Process (EAEPC303)
# -------------------------------------------------------------
sol_dict["02_Probability_Theory_and_Random_Process_EAEPC303"] = [
    {
      "question_id": "PTRP_2025_MID_Q1A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 1,
      "topic": "Conditional Probability & Card Selection",
      "question": "Two cards are drawn from a standard pack of 52 cards. Find the probability that one is a King and the other is a Queen when the drawing is: (a) with replacement, (b) without replacement.",
      "marks": 2,
      "reference": "Papoulis & Pillai (4th Ed), Chapter 2 (Probability Concepts)",
      "solution_markdown": """### **Step-by-Step Solution**

In a standard deck of 52 playing cards:
- Total cards $N = 52$
- Number of Kings $N_K = 4$
- Number of Queens $N_Q = 4$

The event \"one King and one Queen\" occurs in two mutually exclusive sequences: $(K_1 \\cap Q_2)$ or $(Q_1 \\cap K_2)$.

---

#### **Part (a): Drawing With Replacement**
In sampling with replacement, successive draws are independent:
$$P(K_1) = \\frac{4}{52} = \\frac{1}{13}, \\qquad P(Q_2) = \\frac{4}{52} = \\frac{1}{13}$$
$$P(Q_1) = \\frac{4}{52} = \\frac{1}{13}, \\qquad P(K_2) = \\frac{4}{52} = \\frac{1}{13}$$

The total probability is:
$$P(\\text{one King, one Queen}) = P(K_1 \\cap Q_2) + P(Q_1 \\cap K_2)$$
$$P(\\text{with replacement}) = \\left(\\frac{1}{13} \\times \\frac{1}{13}\\right) + \\left(\\frac{1}{13} \\times \\frac{1}{13}\\right) = \\frac{2}{169} \\approx \\mathbf{0.01183 \\ (1.183\\%)}$$

---

#### **Part (b): Drawing Without Replacement**
In sampling without replacement, the sample space shrinks from 52 to 51:
$$P(K_1) = \\frac{4}{52} = \\frac{1}{13}, \\qquad P(Q_2 \\mid K_1) = \\frac{4}{51}$$
$$P(Q_1) = \\frac{4}{52} = \\frac{1}{13}, \\qquad P(K_2 \\mid Q_1) = \\frac{4}{51}$$

The total probability is:
$$P(\\text{without replacement}) = \\left(\\frac{4}{52} \\times \\frac{4}{51}\\right) + \\left(\\frac{4}{52} \\times \\frac{4}{51}\\right) = 2 \\times \\frac{16}{2652} = \\frac{32}{2652} = \\mathbf{\\frac{8}{663} \\approx 0.012066 \\ (1.207\\%)}$$"""
    },
    {
      "question_id": "PTRP_2025_MID_Q1B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 1,
      "topic": "Binomial Distribution & Bernoulli Trials",
      "question": "A fair coin is tossed 10 times. Find the probability of obtaining either 5 heads or 6 heads.",
      "marks": 2,
      "reference": "Peebles (4th Ed), Chapter 2 (Bernoulli Trials)",
      "solution_markdown": """### **Step-by-Step Solution**

Let $X$ denote the number of heads obtained in $n = 10$ independent Bernoulli trials.
- Probability of success (Heads) on a single toss: $p = \\frac{1}{2}$
- Probability of failure (Tails): $q = 1 - p = \\frac{1}{2}$
- $X$ follows the Binomial distribution: $X \\sim B\\left(10, \\frac{1}{2}\\right)$

The probability mass function is:
$$P(X = k) = \\binom{n}{k} p^k q^{n-k} = \\binom{10}{k} \\left(\\frac{1}{2}\\right)^{10} = \\frac{\\binom{10}{k}}{1024}$$

---

#### **Step 1: Probability of exactly 5 Heads ($k = 5$)**
$$\\binom{10}{5} = \\frac{10 \\times 9 \\times 8 \\times 7 \\times 6}{5 \\times 4 \\times 3 \\times 2 \\times 1} = 252$$
$$P(X = 5) = \\frac{252}{1024}$$

---

#### **Step 2: Probability of exactly 6 Heads ($k = 6$)**
$$\\binom{10}{6} = \\binom{10}{4} = \\frac{10 \\times 9 \\times 8 \\times 7}{4 \\times 3 \\times 2 \\times 1} = 210$$
$$P(X = 6) = \\frac{210}{1024}$$

---

#### **Step 3: Total Probability of obtaining 5 or 6 Heads**
Since the events $X = 5$ and $X = 6$ are mutually exclusive:
$$P(X = 5 \\cup X = 6) = P(X = 5) + P(X = 6) = \\frac{252 + 210}{1024} = \\frac{462}{1024} = \\mathbf{\\frac{231}{512} \\approx 0.45117 \\ (45.12\\%)}$$"""
    },
    {
      "question_id": "PTRP_2025_MID_Q2A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Uniform Random Variable Moments",
      "question": "Derive the expressions for the Mean, Mean-Square value, and Variance of a continuous random variable $X$ uniformly distributed over the interval $[a, b]$.",
      "marks": 2,
      "reference": "Peebles (4th Ed), Chapter 3 (Probability Density Functions)",
      "solution_markdown": """### **Step-by-Step Derivation**

For $X \\sim \\mathcal{U}[a, b]$, the probability density function (PDF) is:
$$f_X(x) = \\begin{cases} \\dfrac{1}{b - a}, & a \\le x \\le b \\\\ 0, & \\text{otherwise} \\end{cases}$$

---

#### **1. Mean (First Moment $E[X]$)**
$$E[X] = \\int_{-\\infty}^{\\infty} x f_X(x) \\, dx = \\int_{a}^{b} \\frac{x}{b - a} \\, dx = \\frac{1}{b - a} \\left[ \\frac{x^2}{2} \\right]_a^b$$
$$E[X] = \\frac{b^2 - a^2}{2(b - a)} = \\frac{(b - a)(b + a)}{2(b - a)} = \\mathbf{\\frac{a + b}{2}}$$

---

#### **2. Mean-Square Value (Second Moment $E[X^2]$)**
$$E[X^2] = \\int_{a}^{b} \\frac{x^2}{b - a} \\, dx = \\frac{1}{b - a} \\left[ \\frac{x^3}{3} \\right]_a^b = \\frac{b^3 - a^3}{3(b - a)}$$
Using the algebraic identity $b^3 - a^3 = (b - a)(a^2 + ab + b^2)$:
$$E[X^2] = \\mathbf{\\frac{a^2 + ab + b^2}{3}}$$

---

#### **3. Variance $\\text{Var}(X) = \\sigma_X^2$**
$$\\sigma_X^2 = E[X^2] - (E[X])^2 = \\frac{a^2 + ab + b^2}{3} - \\left( \\frac{a + b}{2} \\right)^2$$
$$\\sigma_X^2 = \\frac{a^2 + ab + b^2}{3} - \\frac{a^2 + 2ab + b^2}{4} = \\frac{4(a^2 + ab + b^2) - 3(a^2 + 2ab + b^2)}{12}$$
$$\\sigma_X^2 = \\frac{a^2 - 2ab + b^2}{12} = \\mathbf{\\frac{(b - a)^2}{12}}$$"""
    },
    {
      "question_id": "PTRP_2025_MID_Q2B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Discrete Random Variable Moments",
      "question": "The PMF of a discrete random variable $X$ is given by: $$P_X(x) = \\begin{cases} \\frac{1}{3}, & x = -2, 0, 2 \\\\ 0, & \\text{otherwise} \\end{cases}$$ Find the mean and variance of $X$.",
      "marks": 2,
      "reference": "Peebles (4th Ed), Chapter 3",
      "solution_markdown": """### **Step-by-Step Solution**

Given the PMF:
$$P_X(-2) = \\frac{1}{3}, \\quad P_X(0) = \\frac{1}{3}, \\quad P_X(2) = \\frac{1}{3}$$

---

#### **Step 1: Expected Value (Mean $\\mu_X = E[X]$)**
$$E[X] = \\sum_{i} x_i P_X(x_i) = (-2)\\left(\\frac{1}{3}\\right) + (0)\\left(\\frac{1}{3}\\right) + (2)\\left(\\frac{1}{3}\\right) = -\\frac{2}{3} + 0 + \\frac{2}{3} = \\mathbf{0}$$

---

#### **Step 2: Second Moment $E[X^2]$**
$$E[X^2] = \\sum_{i} x_i^2 P_X(x_i) = (-2)^2\\left(\\frac{1}{3}\\right) + (0)^2\\left(\\frac{1}{3}\\right) + (2)^2\\left(\\frac{1}{3}\\right) = 4\\left(\\frac{1}{3}\\right) + 0 + 4\\left(\\frac{1}{3}\\right) = \\frac{8}{3}$$

---

#### **Step 3: Variance $\\text{Var}(X)$**
$$\\text{Var}(X) = E[X^2] - (E[X])^2 = \\frac{8}{3} - (0)^2 = \\mathbf{\\frac{8}{3} \\approx 2.667}$$"""
    },
    {
      "question_id": "PTRP_2025_MID_Q3A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Continuous PDF Moments",
      "question": "The probability density function of a random variable $X$ is given by: $$f_X(x) = \\begin{cases} 2x, & 0 < x < 1 \\\\ 0, & \\text{otherwise} \\end{cases}$$ Find the mean and variance of $X$.",
      "marks": 2,
      "reference": "Peebles, Chapter 3",
      "solution_markdown": """### **Step-by-Step Solution**

#### **Step 1: Mean $E[X]$**
$$E[X] = \\int_{-\\infty}^{\\infty} x f_X(x) \\, dx = \\int_{0}^{1} x (2x) \\, dx = 2 \\int_{0}^{1} x^2 \\, dx = 2 \\left[ \\frac{x^3}{3} \\right]_0^1 = \\mathbf{\\frac{2}{3}}$$

---

#### **Step 2: Second Moment $E[X^2]$**
$$E[X^2] = \\int_{0}^{1} x^2 (2x) \\, dx = 2 \\int_{0}^{1} x^3 \\, dx = 2 \\left[ \\frac{x^4}{4} \\right]_0^1 = \\frac{2}{4} = \\mathbf{\\frac{1}{2}}$$

---

#### **Step 3: Variance $\\text{Var}(X)$**
$$\\text{Var}(X) = E[X^2] - (E[X])^2 = \\frac{1}{2} - \\left( \\frac{2}{3} \\right)^2 = \\frac{1}{2} - \\frac{4}{9} = \\frac{9 - 8}{18} = \\mathbf{\\frac{1}{18} \\approx 0.0556}$$"""
    },
    {
      "question_id": "PTRP_2025_MID_Q3B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Joint CDF and Properties",
      "question": "State and define the Joint Cumulative Distribution Function (CDF) of two random variables $X$ and $Y$, and explain its five significant mathematical properties.",
      "marks": 2,
      "reference": "Papoulis & Pillai (4th Ed), Chapter 6",
      "solution_markdown": """### **Step-by-Step Formulation**

#### **Definition:**
The Joint Cumulative Distribution Function $F_{XY}(x,y)$ of two random variables $X$ and $Y$ is defined as the joint probability:
$$F_{XY}(x, y) = P(X \\le x, Y \\le y) \\qquad \\text{for } -\\infty < x < \\infty, -\\infty < y < \\infty$$

---

#### **Significant Properties:**
1. **Range Bounds:**
   $$0 \\le F_{XY}(x, y) \\le 1$$
2. **Extreme Limits:**
   $$F_{XY}(-\\infty, y) = 0, \\quad F_{XY}(x, -\\infty) = 0, \\quad F_{XY}(-\\infty, -\\infty) = 0$$
   $$F_{XY}(\\infty, \\infty) = 1$$
3. **Marginal CDFs:**
   $$F_X(x) = F_{XY}(x, \\infty), \\qquad F_Y(y) = F_{XY}(\\infty, y)$$
4. **Monotonic Non-Decreasing:**
   $F_{XY}(x, y)$ is a non-decreasing function of both variables $x$ and $y$:
   $$\\text{If } x_1 < x_2 \\implies F_{XY}(x_1, y) \\le F_{XY}(x_2, y)$$
5. **Rectangular Probability Region:**
   For any rectangle $[x_1, x_2] \\times [y_1, y_2]$:
   $$P(x_1 < X \\le x_2, y_1 < Y \\le y_2) = F_{XY}(x_2, y_2) - F_{XY}(x_1, y_2) - F_{XY}(x_2, y_1) + F_{XY}(x_1, y_1) \\ge 0$$"""
    },
    {
      "question_id": "PTRP_2025_MID_Q4A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Independence vs Uncorrelated Proof",
      "question": "If $X$ and $Y$ are independent random variables, show that they are uncorrelated.",
      "marks": 2,
      "reference": "Papoulis & Pillai (4th Ed), Chapter 6 (Two Random Variables)",
      "solution_markdown": """### **Step-by-Step Proof**

#### **1. Mathematical Definition of Independence**
Two continuous random variables $X$ and $Y$ are statistically independent if and only if their joint probability density function factors into the product of their marginal PDFs:
$$f_{XY}(x, y) = f_X(x) \\cdot f_Y(y) \\qquad \\forall (x, y)$$

---

#### **2. Evaluation of the Joint Expectation $E[XY]$**
By the definition of expectation for a function of two random variables:
$$E[XY] = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} x y \\cdot f_{XY}(x, y) \\, dx \\, dy$$
Substituting $f_{XY}(x, y) = f_X(x) f_Y(y)$:
$$E[XY] = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} x y \\cdot f_X(x) f_Y(y) \\, dx \\, dy$$
Since the integrals with respect to $x$ and $y$ are completely separable:
$$E[XY] = \\left( \\int_{-\\infty}^{\\infty} x f_X(x) \\, dx \\right) \\left( \\int_{-\\infty}^{\\infty} y f_Y(y) \\, dy \\right) = E[X] \\cdot E[Y]$$

---

#### **3. Evaluation of Covariance $\\text{Cov}(X, Y)$**
The covariance of $X$ and $Y$ is defined as:
$$\\text{Cov}(X, Y) = E[(X - \\mu_X)(Y - \\mu_Y)] = E[XY] - E[X]E[Y]$$
Substituting $E[XY] = E[X]E[Y]$:
$$\\text{Cov}(X, Y) = E[X]E[Y] - E[X]E[Y] = 0$$

---

#### **Conclusion:**
Since $\\text{Cov}(X, Y) = 0$ (and correlation coefficient $\\rho_{XY} = 0$), $X$ and $Y$ are **uncorrelated**.
$$\\mathbf{\\text{Independence} \\implies \\text{Uncorrelated (Q.E.D.)}}$$"""
    },
    {
      "question_id": "PTRP_2025_MID_Q4B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Joint vs Marginal Density Functions",
      "question": "Explain the difference between Joint Density Function and Marginal Density Function with mathematical definitions and relationship formulas.",
      "marks": 2,
      "reference": "Peebles, Chapter 5",
      "solution_markdown": """### **Step-by-Step Solution**

| Feature | Joint Density Function $f_{XY}(x,y)$ | Marginal Density Function $f_X(x), f_Y(y)$ |
| :--- | :--- | :--- |
| **Definition** | Describes the simultaneous probability distribution of two random variables $X$ and $Y$. | Describes the individual probability distribution of one random variable, integrating out the other. |
| **Formula** | $f_{XY}(x,y) = \\dfrac{\\partial^2 F_{XY}(x,y)}{\\partial x \\partial y}$ | $f_X(x) = \\int_{-\\infty}^{\\infty} f_{XY}(x,y)\\,dy$ and $f_Y(y) = \\int_{-\\infty}^{\\infty} f_{XY}(x,y)\\,dx$ |
| **Normalization** | $\\int_{-\\infty}^{\\infty}\\int_{-\\infty}^{\\infty} f_{XY}(x,y)\\,dx\\,dy = 1$ | $\\int_{-\\infty}^{\\infty} f_X(x)\\,dx = 1$ |

**Physical Significance:**
- $f_{XY}(x,y)\\,dx\\,dy = P(x < X \\le x+dx, y < Y \\le y+dy)$ gives probability in 2D differential element.
- Marginal densities allow studying one random variable when the other is not observed."""
    },
    {
      "question_id": "PTRP_2025_MID_Q5A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Central Joint Moments and Covariance",
      "question": "Define the $(i, j)$-th central joint moment of two random variables $X$ and $Y$. Write down the mathematical expression for the Covariance of $X$ and $Y$ and explain its physical significance.",
      "marks": 2,
      "reference": "Peebles, Chapter 5",
      "solution_markdown": """### **Step-by-Step Formulation**

#### **1. Definition of $(i, j)$-th Central Moment:**
The $(i, j)$-th joint central moment $\\mu_{ij}$ of random variables $X$ and $Y$ is defined as:
$$\\mu_{ij} = E\\left[ (X - \\mu_X)^i (Y - \\mu_Y)^j \\right] = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} (x - \\mu_X)^i (y - \\mu_Y)^j f_{XY}(x, y) \\, dx \\, dy$$
where $\\mu_X = E[X]$ and $\\mu_Y = E[Y]$.

---

#### **2. Covariance Expression:**
Covariance is the $(1, 1)$-th central moment $\\mu_{11}$:
$$\\text{Cov}(X, Y) = \\sigma_{XY} = \\mu_{11} = E\\left[ (X - \\mu_X)(Y - \\mu_Y) \\right] = E[XY] - \\mu_X \\mu_Y$$

---

#### **3. Physical Significance:**
- **Measure of Linear Association:** Covariance indicates the direction of the linear relationship between $X$ and $Y$.
- $\\text{Cov}(X, Y) > 0$: As $X$ increases, $Y$ tends to increase.
- $\\text{Cov}(X, Y) < 0$: As $X$ increases, $Y$ tends to decrease.
- $\\text{Cov}(X, Y) = 0$: No linear relationship (uncorrelated)."""
    },
    {
      "question_id": "PTRP_2025_MID_Q5B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC303",
      "unit": 2,
      "topic": "Variance of Sum for Uncorrelated Variables",
      "question": "If $X$ and $Y$ are uncorrelated random variables, prove that: $$\\sigma_{X+Y}^2 = \\sigma_X^2 + \\sigma_Y^2$$ where $\\sigma_{X+Y}^2 = E\\left[(X+Y)^2\\right] - \\big(E[X+Y]\\big)^2$.",
      "marks": 2,
      "reference": "Papoulis, Chapter 6",
      "solution_markdown": """### **Step-by-Step Proof**

Let $Z = X + Y$.
$$\\mu_Z = E[Z] = E[X + Y] = E[X] + E[Y] = \\mu_X + \\mu_Y$$

The variance of $Z = X + Y$ is:
$$\\sigma_{X+Y}^2 = E\\left[ (Z - \\mu_Z)^2 \\right] = E\\left[ \\big((X - \\mu_X) + (Y - \\mu_Y)\\big)^2 \\right]$$
Expanding the square:
$$\\sigma_{X+Y}^2 = E\\left[ (X - \\mu_X)^2 + 2(X - \\mu_X)(Y - \\mu_Y) + (Y - \\mu_Y)^2 \\right]$$
Using linearity of expectation:
$$\\sigma_{X+Y}^2 = E\\left[(X - \\mu_X)^2\\right] + 2 E\\left[(X - \\mu_X)(Y - \\mu_Y)\\right] + E\\left[(Y - \\mu_Y)^2\\right]$$
$$\\sigma_{X+Y}^2 = \\sigma_X^2 + 2\\text{Cov}(X, Y) + \\sigma_Y^2$$

Since $X$ and $Y$ are **uncorrelated**, $\\text{Cov}(X, Y) = 0$.
$$\\therefore \\mathbf{\\sigma_{X+Y}^2 = \\sigma_X^2 + \\sigma_Y^2} \\quad \\text{(Q.E.D.)}$$"""
    }
]

print("Subject 2 loaded")

# -------------------------------------------------------------
# SUBJECT 3: Microelectronics Circuits and Applications (EAEPC304)
# -------------------------------------------------------------
sol_dict["03_Microelectronics_Circuits_and_Applications_EAEPC304"] = [
    {
      "question_id": "ME_2025_MID_Q1A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 1,
      "topic": "Amplifier Power, Gain & Efficiency",
      "question": "An amplifier operating from $\\pm 10\\text{ V}$ power supplies is fed at its input with a sine wave of $1\\text{ V}$ peak value and delivers a $9\\text{ V}$ peak sine wave to a $1\\text{ k}\\Omega$ load resistance. The amplifier draws a current of $9.5\\text{ mA}$ from each of its two power supplies. The input current is $0.1\\text{ mA}$ peak. Find: (i) Voltage Gain $A_v$, (ii) Current Gain $A_i$, (iii) Power Gain $A_p$, (iv) Total DC Power $P_{dc}$, (v) Power Dissipated in Amplifier $P_{diss}$, (vi) Amplifier Efficiency $\\eta$.",
      "marks": 2,
      "reference": "Sedra & Smith (7th/8th Ed), Chapter 1 (Signals and Amplifiers, Section 1.4)",
      "solution_markdown": """### **Step-by-Step Solution**

#### **Given Parameters:**
- Supply voltages: $V_{CC} = +10\\text{ V}, V_{EE} = -10\\text{ V}$
- DC supply currents: $I_{CC} = I_{EE} = 9.5\\text{ mA} = 9.5 \\times 10^{-3}\\text{ A}$
- Input peak voltage: $\\hat{V}_i = 1\\text{ V}$
- Input peak current: $\\hat{I}_i = 0.1\\text{ mA}$
- Output peak voltage: $\\hat{V}_o = 9\\text{ V}$
- Load resistance: $R_L = 1\\text{ k}\\Omega = 1000\\,\\Omega$

---

#### **1. Voltage Gain ($A_v$)**
$$A_v = \\frac{\\hat{V}_o}{\\hat{V}_i} = \\frac{9\\text{ V}}{1\\text{ V}} = \\mathbf{9\\text{ V/V}} \\quad \\big(A_{v(dB)} = 20\\log_{10}(9) \\approx \\mathbf{19.08\\text{ dB}}\\big)$$

---

#### **2. Current Gain ($A_i$)**
Peak load current: $\\hat{I}_o = \\frac{\\hat{V}_o}{R_L} = \\frac{9\\text{ V}}{1\\text{ k}\\Omega} = 9\\text{ mA}$
$$A_i = \\frac{\\hat{I}_o}{\\hat{I}_i} = \\frac{9\\text{ mA}}{0.1\\text{ mA}} = \\mathbf{90\\text{ A/A}} \\quad \\big(A_{i(dB)} = 20\\log_{10}(90) \\approx \\mathbf{39.08\\text{ dB}}\\big)$$

---

#### **3. Power Gain ($A_p$)**
Average input signal power:
$$P_{in} = \\frac{1}{2} \\hat{V}_i \\hat{I}_i = \\frac{1}{2}(1\\text{ V})(0.1\\text{ mA}) = 0.05\\text{ mW}$$
Average output load power:
$$P_L = \\frac{1}{2} \\frac{\\hat{V}_o^2}{R_L} = \\frac{1}{2} \\frac{9^2}{1000} = \\frac{81}{2000}\\text{ W} = 40.5\\text{ mW}$$
$$A_p = \\frac{P_L}{P_{in}} = \\frac{40.5\\text{ mW}}{0.05\\text{ mW}} = \\mathbf{810\\text{ W/W}} \\quad \\big(A_{p(dB)} = 10\\log_{10}(810) \\approx \\mathbf{29.08\\text{ dB}}\\big)$$

---

#### **4. DC Power Input ($P_{dc}$)**
$$P_{dc} = V_{CC} I_{CC} + |V_{EE}| I_{EE} = (10\\text{ V})(9.5\\text{ mA}) + (10\\text{ V})(9.5\\text{ mA}) = 95\\text{ mW} + 95\\text{ mW} = \\mathbf{190\\text{ mW}}$$

---

#### **5. Power Dissipated in Amplifier ($P_{diss}$)**
By conservation of energy:
$$P_{diss} = P_{dc} + P_{in} - P_L = 190\\text{ mW} + 0.05\\text{ mW} - 40.5\\text{ mW} = \\mathbf{149.55\\text{ mW}}$$

---

#### **6. Amplifier Power Conversion Efficiency ($\\eta$)**
$$\\eta = \\frac{P_L}{P_{dc}} \\times 100\\% = \\frac{40.5\\text{ mW}}{190\\text{ mW}} \\times 100\\% = \\mathbf{21.32\\%}$$"""
    },
    {
      "question_id": "ME_2025_MID_Q1B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 1,
      "topic": "Small-Signal Linearization Technique",
      "question": "Explain the small-signal linearization technique around the DC Operating Point (Q-Point) for non-linear electronic devices (MOSFET / BJT). Derive the small-signal condition.",
      "marks": 2,
      "reference": "Sedra & Smith, Chapter 4 & 5",
      "solution_markdown": """### **Step-by-Step Explanation & Derivation**

#### **1. Concept of Linearization:**
Nonlinear electronic devices (e.g., MOSFET with $i_D \\propto v_{GS}^2$ or BJT with $i_C \\propto e^{v_{BE}/V_T}$) distort large signals. To achieve linear amplification without harmonic distortion, we operate the device with:
1. A large DC bias voltage to establish a quiescent point (Q-point).
2. A very small time-varying AC signal superimposed on the DC bias: $v_{GS}(t) = V_{GS} + v_{gs}(t)$.

---

#### **2. Mathematical Taylor Series Expansion:**
For a MOSFET in saturation:
$$i_D = \\frac{1}{2} k'_n \\frac{W}{L} (v_{GS} - V_t)^2 = \\frac{1}{2} k'_n \\frac{W}{L} \\big((V_{GS} - V_t) + v_{gs}\\big)^2$$
Let overdrive voltage $V_{OV} = V_{GS} - V_t$:
$$i_D = \\frac{1}{2} k'_n \\frac{W}{L} V_{OV}^2 + k'_n \\frac{W}{L} V_{OV} v_{gs} + \\frac{1}{2} k'_n \\frac{W}{L} v_{gs}^2$$
$$i_D = I_D + g_m v_{gs} + \\frac{1}{2} k'_n \\frac{W}{L} v_{gs}^2$$
where:
- DC bias current: $I_D = \\frac{1}{2} k'_n \\frac{W}{L} V_{OV}^2$
- Transconductance: $g_m = \\left.\\frac{\\partial i_D}{\\partial v_{GS}}\\right|_{Q} = k'_n \\frac{W}{L} V_{OV} = \\frac{2I_D}{V_{OV}}$

---

#### **3. Small-Signal Condition:**
For the signal component $i_d(t)$ to be linearly proportional to $v_{gs}(t)$ ($i_d \\approx g_m v_{gs}$), the second-order nonlinear term must be negligible:
$$\\frac{1}{2} k'_n \\frac{W}{L} v_{gs}^2 \\ll k'_n \\frac{W}{L} V_{OV} v_{gs} \\implies \\mathbf{v_{gs} \\ll 2 V_{OV}}$$
For BJTs, the corresponding condition is $v_{be} \\ll V_T \\approx 25\\text{ mV}$."""
    },
    {
      "question_id": "ME_2025_MID_Q2A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 1,
      "topic": "MOSFET Voltage-Controlled Resistor",
      "question": "Show that for small values of drain-to-source voltage $v_{DS}$, the MOSFET operates as a linear voltage-controlled resistance between drain and source. Derive the expression for $r_{DS}$.",
      "marks": 2,
      "reference": "Sedra & Smith (7th/8th Ed), Chapter 5 (MOSFETs, Section 5.1)",
      "solution_markdown": """### **Step-by-Step Derivation**

#### **1. MOSFET Current-Voltage Equation in the Triode Region:**
For an n-channel enhancement MOSFET with $v_{GS} > V_t$ and $v_{DS} < v_{GS} - V_t$, the drain current is:
$$i_D = k'_n \\left(\\frac{W}{L}\\right) \\left[ (v_{GS} - V_t)v_{DS} - \\frac{1}{2}v_{DS}^2 \\right]$$
where:
- $k'_n = \\mu_n C_{ox}$ is the process transconductance parameter
- $W/L$ is the transistor aspect ratio
- $V_{OV} = v_{GS} - V_t$ is the overdrive voltage

---

#### **2. Deep Triode Approximation ($v_{DS} \\ll 2 V_{OV}$):**
When $v_{DS}$ is very small such that $v_{DS} \\ll 2(v_{GS} - V_t)$, the quadratic term $\\frac{1}{2}v_{DS}^2$ becomes negligible compared to $(v_{GS} - V_t)v_{DS}$:
$$i_D \\approx k'_n \\left(\\frac{W}{L}\\right)(v_{GS} - V_t) \\cdot v_{DS} = k'_n \\left(\\frac{W}{L}\\right) V_{OV} \\cdot v_{DS}$$

---

#### **3. Derivation of Channel Resistance ($r_{DS}$):**
Since $i_D$ is linearly proportional to $v_{DS}$, the channel behaves as an ideal linear resistor:
$$r_{DS} = \\frac{v_{DS}}{i_D} = \\mathbf{\\frac{1}{k'_n \\left(\\frac{W}{L}\\right)(v_{GS} - V_t)} = \\frac{1}{k'_n \\left(\\frac{W}{L}\\right) V_{OV}}}$$

---

#### **4. Conclusion:**
- The channel resistance $r_{DS}$ is controlled electronically by adjusting the gate-to-source voltage $v_{GS}$.
- Increasing $v_{GS}$ widens the conducting inversion layer channel, thereby reducing $r_{DS}$."""
    },
    {
      "question_id": "ME_2025_MID_Q2B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 1,
      "topic": "MOSFET vs BJT in VLSI Design",
      "question": "State the key advantages of MOSFETs over BJTs that make them the dominant technology in modern Very Large Scale Integration (VLSI) circuits.",
      "marks": 2,
      "reference": "Sedra & Smith, Chapter 5",
      "solution_markdown": """### **Step-by-Step Solution**

| Feature | MOSFET Advantages in VLSI | BJT Comparison |
| :--- | :--- | :--- |
| **1. Packing Density** | Extremely compact physical footprint ($<5\\text{ nm}$ technology nodes). Simple planar fabrication. | Requires larger area due to deep diffusion wells and isolation tubs. |
| **2. Static Gate Current** | Insulated gate ($SiO_2$/High-$k$) draws zero DC current ($I_G \\approx 0$), enabling billions of gates without thermal runaway. | Base draws continuous DC current ($I_B = I_C/\\beta$), causing massive static power dissipation. |
| **3. Self-Isolation** | Adjacent MOS devices are naturally self-isolated when reverse-biased substrate is used. | Requires dedicated p-n isolation junctions or trench isolation. |
| **4. Bilateral Conduction** | Channel conducts symmetrically in both directions ($D \\leftrightarrow S$), ideal for transmission gates and DRAM pass transistors. | Asymmetric emitter-collector doping makes reverse operation inefficient. |
| **5. Dynamic CMOS Logic** | CMOS dissipates power only during logic transitions ($P_{dyn} = C V_{DD}^2 f$), with near-zero quiescent dissipation. | Bipolar logic (e.g., ECL, TTL) continuously draws DC power. |"""
    },
    {
      "question_id": "ME_2025_MID_Q3A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 1,
      "topic": "NMOS Physical Structure & Inversion Layer",
      "question": "Describe the physical structure and operation of an Enhancement-type NMOS transistor. Explain the formation of the inversion layer and define Threshold Voltage $V_t$.",
      "marks": 2,
      "reference": "Sedra & Smith, Chapter 5, Section 5.1",
      "solution_markdown": """### **Step-by-Step Solution**

#### **1. Physical Structure:**
- **Substrate:** p-type silicon wafer body (doped with boron acceptors $N_A$).
- **Source & Drain:** Heavily doped $n^+$ regions diffused into the p-substrate, separated by channel length $L$.
- **Gate Dielectric:** Thin insulating silicon dioxide layer ($SiO_2$, thickness $t_{ox}$) creating gate oxide capacitance $C_{ox} = \\varepsilon_{ox}/t_{ox}$.
- **Gate Electrode:** Highly conductive polysilicon or metal deposited on top of oxide.

---

#### **2. Operation & Inversion Layer Formation:**
1. **Accumulation ($v_{GS} < 0$):** Holes are attracted to the surface; no conduction channel.
2. **Depletion ($0 < v_{GS} < V_t$):** Positive gate voltage repels mobile holes from the surface, uncovering uncompensated negative acceptor ions ($N_A^-$) to create a depletion region.
3. **Strong Inversion ($v_{GS} \\ge V_t$):** Gate field attracts minority free electrons from the substrate and $n^+$ regions to the oxide-silicon interface. When surface electron concentration exceeds substrate hole concentration, an n-type conducting channel (\"inversion layer\") connects source to drain.

---

#### **3. Definition of Threshold Voltage ($V_t$):**
The threshold voltage $V_t$ (or $V_{tn}$) is the minimum gate-to-source voltage required to produce strong inversion at the semiconductor surface:
$$V_t = V_{t0} + \\gamma \\left( \\sqrt{2\\phi_F + V_{SB}} - \\sqrt{2\\phi_F} \\right)$$
where $\\gamma$ is body effect parameter and $\\phi_F$ is Fermi potential."""
    },
    {
      "question_id": "ME_2025_MID_Q3B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 2,
      "topic": "Ebers-Moll Model and BJT Modes",
      "question": "Present the Ebers-Moll model for an npn Bipolar Junction Transistor (BJT). Write the terminal current equations and define the four regions of operation.",
      "marks": 2,
      "reference": "Sedra & Smith, Chapter 6",
      "solution_markdown": """### **Step-by-Step Solution**

#### **1. Ebers-Moll Equations for NPN BJT:**
The Ebers-Moll model represents the BJT as two back-to-back ideal diodes interacting via current-controlled sources:
$$i_E = I_{SE} \\left( e^{v_{BE}/V_T} - 1 \\right) - \\alpha_R I_{SC} \\left( e^{v_{BC}/V_T} - 1 \\right)$$
$$i_C = \\alpha_F I_{SE} \\left( e^{v_{BE}/V_T} - 1 \\right) - I_{SC} \\left( e^{v_{BC}/V_T} - 1 \\right)$$
$$i_B = i_E - i_C = (1 - \\alpha_F) I_{SE} \\left( e^{v_{BE}/V_T} - 1 \\right) + (1 - \\alpha_R) I_{SC} \\left( e^{v_{BC}/V_T} - 1 \\right)$$
By reciprocity theorem: $\\alpha_F I_{SE} = \\alpha_R I_{SC} = I_S$.

---

#### **2. Four Regions of Operation:**
| Region | Base-Emitter Junction (EBJ) | Base-Collector Junction (CBJ) | Primary Application |
| :--- | :--- | :--- | :--- |
| **Cutoff** | Reverse Biased ($v_{BE} < 0.5\\text{V}$) | Reverse Biased ($v_{BC} \\le 0$) | OFF switch ($i_C \\approx 0$) |
| **Forward-Active** | Forward Biased ($v_{BE} \\approx 0.7\\text{V}$) | Reverse Biased ($v_{BC} \\le 0$) | Linear Analog Amplification ($i_C = \\beta i_B$) |
| **Saturation** | Forward Biased ($v_{BE} \\approx 0.7\\text{V}$) | Forward Biased ($v_{BC} > 0.4\\text{V}$) | ON switch ($V_{CE(sat)} \\approx 0.2\\text{V}$) |
| **Reverse-Active** | Reverse Biased | Forward Biased | Specialized analog switching |"""
    },
    {
      "question_id": "ME_2025_MID_Q4A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 2,
      "topic": "Small-Signal BJT Models (Hybrid-pi vs T-Model)",
      "question": "Compare the Hybrid-$\\pi$ and T-equivalent small-signal models of a BJT. Give formulas for the small-signal parameters $g_m, r_\\pi, r_e$, and $r_o$.",
      "marks": 2,
      "reference": "Sedra & Smith (7th/8th Ed), Chapter 6 (Bipolar Junction Transistors, Section 6.5)",
      "solution_markdown": """### **Step-by-Step Formulation**

#### **1. Small-Signal Parameter Formulas (at DC bias point $I_C, I_B, I_E$):**
- **Transconductance:** $g_m = \\dfrac{I_C}{V_T} = \\dfrac{\\alpha I_E}{V_T}$
- **Base-Emitter Input Resistance:** $r_\\pi = \\dfrac{V_T}{I_B} = \\dfrac{\\beta}{g_m} = (\\beta + 1) r_e$
- **Emitter Resistance:** $r_e = \\dfrac{V_T}{I_E} = \\dfrac{\\alpha}{g_m} = \\dfrac{r_\\pi}{\\beta + 1}$
- **Output Resistance (Early Effect):** $r_o = \\dfrac{V_A + V_{CE}}{I_C} \\approx \\dfrac{V_A}{I_C}$
where thermal voltage $V_T = \\frac{kT}{q} \\approx 25-26\\text{ mV}$ at room temperature.

---

#### **2. Hybrid-$\\pi$ Model vs T-Model Structural Differences:**
| Feature | Hybrid-$\\pi$ Model | T-Model |
| :--- | :--- | :--- |
| **Circuit Topology** | Resistor $r_\\pi$ between Base and Emitter; voltage-controlled current source $g_m v_{be}$ across Collector-Emitter. | Resistor $r_e$ in Emitter leg; current-controlled source $\\alpha i_e$ (or $g_m v_{be}$) in Collector. |
| **Best Used For** | Common-Emitter (CE) amplifiers with grounded emitter. | Common-Base (CB) amplifiers and CE amplifiers with emitter degeneration ($R_E$). |"""
    },
    {
      "question_id": "ME_2025_MID_Q5",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC304",
      "unit": 3,
      "topic": "MOS Differential Pair Small-Signal Analysis",
      "question": "A MOS differential pair is biased with a constant current source $I = 0.4\\text{ mA}$. The transistors have $k'_n(W/L) = 4\\text{ mA/V}^2, V_t = 0.5\\text{ V}$, and $R_D = 5\\text{ k}\\Omega$. (a) Find $V_{OV}$ and $g_m$ for each transistor. (b) Find the differential voltage gain $A_d$. (c) Determine the maximum differential input signal $v_{id,max}$ for which both transistors remain in saturation.",
      "marks": 2,
      "reference": "Sedra & Smith (7th/8th Ed), Chapter 9 (Differential Amplifiers)",
      "solution_markdown": """### **Step-by-Step Solution**

#### **Given Parameters:**
- Tail bias current: $I = 0.4\\text{ mA}$
- $k'_n(W/L) = 4\\text{ mA/V}^2$
- Threshold voltage: $V_t = 0.5\\text{ V}$
- Drain resistor: $R_D = 5\\text{ k}\\Omega$

---

#### **Part (a): Overdrive Voltage $V_{OV}$ and Transconductance $g_m$**
In equilibrium with zero differential input ($v_{id} = 0$), the tail current splits equally between $Q_1$ and $Q_2$:
$$I_{D1} = I_{D2} = \\frac{I}{2} = \\frac{0.4\\text{ mA}}{2} = 0.2\\text{ mA}$$
From saturation equation:
$$I_D = \\frac{1}{2} k'_n \\left(\\frac{W}{L}\\right) V_{OV}^2 \\implies 0.2 = \\frac{1}{2}(4) V_{OV}^2 = 2 V_{OV}^2$$
$$V_{OV}^2 = \\frac{0.2}{2} = 0.1 \\implies \\mathbf{V_{OV} = \\sqrt{0.1} \\approx 0.3162\\text{ V} \\ (316.2\\text{ mV})}$$

Transconductance of each transistor:
$$g_m = \\frac{2 I_D}{V_{OV}} = \\frac{2(0.2\\text{ mA})}{0.3162\\text{ V}} = \\mathbf{1.265\\text{ mA/V} = 1.265\\text{ mS}}$$

---

#### **Part (b): Differential Voltage Gain $A_d$**
For differential output taken between the two drains:
$$A_d = \\frac{v_{od}}{v_{id}} = -g_m R_D = -(1.265\\text{ mA/V}) \\times (5\\text{ k}\\Omega) = \\mathbf{-6.325\\text{ V/V}} \\quad \\big(|A_d|_{dB} = 20\\log_{10}(6.325) \\approx \\mathbf{16.02\\text{ dB}}\\big)$$

---

#### **Part (c): Maximum Differential Input Signal $v_{id,max}$**
The entire current $I$ is steered completely into one branch when:
$$v_{id,max} = \\sqrt{2} \\cdot V_{OV} = \\sqrt{2} \\times 0.3162\\text{ V} = \\mathbf{0.4472\\text{ V} \\ (447.2\\text{ mV})}$$"""
    }
]

print("Subject 3 loaded")

# -------------------------------------------------------------
# SUBJECT 4: Digital Circuits and Systems (EAEPC305)
# -------------------------------------------------------------
sol_dict["04_Digital_Circuits_and_Systems_EAEPC305"] = [
    {
      "question_id": "DCS_2025_MID_Q1A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 1,
      "topic": "Number Base Conversions",
      "question": "Convert the decimal number $(23)_{10}$ into: (i) Binary, (ii) Octal, (iii) Hexadecimal, (iv) BCD (8421 code), (v) Excess-3 code.",
      "marks": 2,
      "reference": "M. Morris Mano & Michael D. Ciletti (5th Ed), Chapter 1 (Digital Systems and Binary Numbers)",
      "solution_markdown": """### **Step-by-Step Conversions**

Given Decimal Number: $N = (23)_{10}$

---

#### **(i) Decimal to Binary Conversion:**
Successive division by 2:
- $23 \\div 2 = 11$ with remainder **1** (LSB)
- $11 \\div 2 = 5$ with remainder **1**
- $5 \\div 2 = 2$ with remainder **1**
- $2 \\div 2 = 1$ with remainder **0**
- $1 \\div 2 = 0$ with remainder **1** (MSB)
Reading remainders from bottom to top:
$$\\mathbf{(23)_{10} = (10111)_2}$$

---

#### **(ii) Decimal to Octal Conversion:**
Successive division by 8:
- $23 \\div 8 = 2$ with remainder **7** (LSB)
- $2 \\div 8 = 0$ with remainder **2** (MSB)
$$\\mathbf{(23)_{10} = (27)_8}$$

---

#### **(iii) Decimal to Hexadecimal Conversion:**
Successive division by 16:
- $23 \\div 16 = 1$ with remainder **7** (LSB)
- $1 \\div 16 = 0$ with remainder **1** (MSB)
$$\\mathbf{(23)_{10} = (17)_{16}}$$

---

#### **(iv) Decimal to 8421 BCD Code:**
Convert each decimal digit independently into its 4-bit binary equivalent:
- Digit $2 \\implies (0010)_2$
- Digit $3 \\implies (0011)_2$
$$\\mathbf{(23)_{10} = (0010\\ 0011)_{BCD}}$$

---

#### **(v) Decimal to Excess-3 (XS-3) Code:**
Add $(3)_{10}$ to each decimal digit before converting to 4-bit binary:
- First digit: $2 + 3 = 5 \\implies (0101)_2$
- Second digit: $3 + 3 = 6 \\implies (0110)_2$
$$\\mathbf{(23)_{10} = (0101\\ 0110)_{XS-3}}$$"""
    },
    {
      "question_id": "DCS_2025_MID_Q1B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 1,
      "topic": "2's Complement Subtraction",
      "question": "Perform the subtraction $(14.75)_{10} - (9.25)_{10}$ using 2's complement arithmetic in fixed-point binary format.",
      "marks": 2,
      "reference": "Mano & Ciletti (5th Ed), Chapter 1",
      "solution_markdown": """### **Step-by-Step Solution**

Let $M = (14.75)_{10}$ (Minuend) and $N = (9.25)_{10}$ (Subtrahend).

---

#### **Step 1: Convert Numbers to Binary (using 8 bits: 6 integer, 2 fractional)**
- $M = 14 + 0.75 = (001110.11)_2$
- $N = 9 + 0.25 = (001001.01)_2$

---

#### **Step 2: Find the 2's Complement of the Subtrahend ($N$)**
1. Take 1's complement of $N$:
   $$\\text{1's comp of } (001001.01)_2 = (110110.10)_2$$
2. Add 1 to the LSB ($0.01_2$):
   $$\\text{2's comp of } N = 110110.10 + 000000.01 = (110110.11)_2$$

---

#### **Step 3: Add $M$ to the 2's Complement of $N$**
$$\\begin{array}{r@{\\quad}l}
  & 001110.11 \\quad (M = +14.75) \\\\
+ & 110110.11 \\quad (\\text{2's comp of } N = -9.25) \\\\
\\hline
(1) & 000101.10
\\end{array}$$

---

#### **Step 4: Analyze Result**
- **End-Around Carry Generated:** The carry of 1 indicates that the result is **positive** and already in standard binary form.
- Discarding the carry gives the true magnitude:
$$(000101.10)_2 = 4 + 1 + 0.5 = \\mathbf{+5.5}$$
- Verification: $14.75 - 9.25 = \\mathbf{5.5}$ (Correct)."""
    },
    {
      "question_id": "DCS_2025_MID_Q2A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 1,
      "topic": "BCD Addition and Correction Rules",
      "question": "Perform the BCD addition of $(724)_{10} + (539)_{10}$ using BCD arithmetic. State the correction rule when a sum digit exceeds 9 or produces an end carry.",
      "marks": 2,
      "reference": "Mano & Ciletti, Chapter 1",
      "solution_markdown": """### **Step-by-Step Solution**

#### **BCD Correction Rule:**
If the 4-bit binary sum of any BCD digit group exceeds $(9)_{10} = (1001)_2$ or generates an output carry ($C_{out}=1$), it represents an invalid BCD code. To correct it, **add $6 = (0110)_2$** to that group and propagate the resulting carry to the next higher decade.

---

#### **Step-by-Step Addition:**
- $(724)_{10} = (0111 \\ 0010 \\ 0100)_{BCD}$
- $(539)_{10} = (0101 \\ 0011 \\ 1001)_{BCD}$

---

#### **1. Units Decade ($4 + 9$):**
$$\\begin{array}{r@{\\quad}l}
  & 0100 \\\\
+ & 1001 \\\\
\\hline
  & 1101 \\quad (= 13 > 9, \\text{ Invalid BCD!}) \\\\
+ & 0110 \\quad (\\text{Add } 6) \\\\
\\hline
(1) & 0011 \\quad (= 3, \\text{ Carry } 1 \\text{ to tens})
\\end{array}$$

---

#### **2. Tens Decade ($2 + 3 + 1_{\\text{carry}} = 6$):**
$$\\begin{array}{r@{\\quad}l}
  & 0010 \\\\
+ & 0011 \\\\
+ & 0001 \\quad (\\text{Carry in}) \\\\
\\hline
  & 0110 \\quad (= 6 \\le 9, \\text{ Valid, no correction})
\\end{array}$$

---

#### **3. Hundreds Decade ($7 + 5 = 12$):**
$$\\begin{array}{r@{\\quad}l}
  & 0111 \\\\
+ & 0101 \\\\
\\hline
  & 1100 \\quad (= 12 > 9, \\text{ Invalid BCD!}) \\\\
+ & 0110 \\quad (\\text{Add } 6) \\\\
\\hline
(1) & 0010 \\quad (= 2, \\text{ Carry } 1 \\text{ to thousands})
\\end{array}$$

---

#### **Final Result:**
$$(0001 \\ 0010 \\ 0110 \\ 0011)_{BCD} = \\mathbf{(1263)_{10}}$$"""
    },
    {
      "question_id": "DCS_2025_MID_Q2B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 1,
      "topic": "Boolean Algebra & De Morgan Proof",
      "question": "Prove the following Boolean identity algebraically and verify using a Truth Table: $$\\overline{A \\cdot B + \\overline{A} \\cdot B} = \\overline{B}$$",
      "marks": 2,
      "reference": "Mano & Ciletti, Chapter 2 (Boolean Algebra)",
      "solution_markdown": """### **Step-by-Step Proof**

#### **Method 1: Algebraic Proof**
Given expression:
$$LHS = \\overline{A \\cdot B + \\overline{A} \\cdot B}$$
1. Factor out common literal $B$ inside the bar using Distributive Law:
   $$A \\cdot B + \\overline{A} \\cdot B = (A + \\overline{A}) \\cdot B$$
2. Since $A + \\overline{A} = 1$ (Complementarity Law):
   $$(1) \\cdot B = B$$
3. Taking the overall complement:
   $$LHS = \\overline{B} = RHS$$
$$\\therefore \\mathbf{LHS = RHS} \\quad \\text{(Algebraically Verified)}$$

---

#### **Method 2: Truth Table Verification**

| $A$ | $B$ | $\\overline{A}$ | $A \\cdot B$ | $\\overline{A} \\cdot B$ | $A \\cdot B + \\overline{A} \\cdot B$ | $LHS = \\overline{A \\cdot B + \\overline{A} \\cdot B}$ | $RHS = \\overline{B}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 0 | 0 | 1 | 0 | 0 | 0 | **1** | **1** |
| 0 | 1 | 1 | 0 | 1 | 1 | **0** | **0** |
| 1 | 0 | 0 | 0 | 0 | 0 | **1** | **1** |
| 1 | 1 | 0 | 1 | 0 | 1 | **0** | **0** |

Columns $LHS$ and $RHS$ are identical for all input combinations."""
    },
    {
      "question_id": "DCS_2025_MID_Q3A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 2,
      "topic": "Binary to Gray Code Converter",
      "question": "Design a combinational logic circuit for a 3-bit Binary-to-Gray code converter. Construct the truth table, K-maps, and obtain minimal logic expressions.",
      "marks": 2,
      "reference": "Mano & Ciletti (5th Ed), Chapter 4 (Combinational Logic)",
      "solution_markdown": """### **Step-by-Step Solution**

Let the 3-bit Binary input be $B_2 B_1 B_0$ (where $B_2$ is MSB) and the 3-bit Gray code output be $G_2 G_1 G_0$.

---

#### **1. Truth Table**

| Dec | Binary ($B_2 B_1 B_0$) | Gray ($G_2 G_1 G_0$) |
| :---: | :---: | :---: |
| 0 | 0 0 0 | 0 0 0 |
| 1 | 0 0 1 | 0 0 1 |
| 2 | 0 1 0 | 0 1 1 |
| 3 | 0 1 1 | 0 1 0 |
| 4 | 1 0 0 | 1 1 0 |
| 5 | 1 0 1 | 1 1 1 |
| 6 | 1 1 0 | 1 0 1 |
| 7 | 1 1 1 | 1 0 0 |

---

#### **2. Boolean Equations from K-Maps**
- **For $G_2$:**
  $$G_2 = \\sum m(4, 5, 6, 7) = B_2$$
- **For $G_1$:**
  $$G_1 = \\sum m(2, 3, 4, 5) = \\overline{B}_2 B_1 + B_2 \\overline{B}_1 = \\mathbf{B_2 \\oplus B_1}$$
- **For $G_0$:**
  $$G_0 = \\sum m(1, 2, 5, 6) = \\overline{B}_1 B_0 + B_1 \\overline{B}_0 = \\mathbf{B_1 \\oplus B_0}$$

---

#### **3. Logic Circuit Implementation**
The circuit is implemented using **two 2-input XOR gates**:
- $G_2 = B_2$ (direct wire)
- $G_1 = B_2 \\oplus B_1$
- $G_0 = B_1 \\oplus B_0$"""
    },
    {
      "question_id": "DCS_2025_MID_Q3B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 2,
      "topic": "Half Subtractor using NAND Gates",
      "question": "Design a Half Subtractor circuit using only 2-input NAND gates. Draw the gate-level schematic and prove the Boolean logic.",
      "marks": 2,
      "reference": "Mano & Ciletti, Chapter 4",
      "solution_markdown": """### **Step-by-Step Solution**

#### **1. Half Subtractor Equations:**
- **Difference:** $D = A \\oplus B = A\\overline{B} + \\overline{A}B$
- **Borrow:** $B_{out} = \\overline{A}B$

---

#### **2. NAND-Only Implementation:**
1. **NAND 1:** $N_1 = \\overline{AB}$
2. **NAND 2:** $N_2 = \\overline{A \\cdot N_1} = \\overline{A \\cdot \\overline{AB}} = \\overline{A(\\overline{A} + \\overline{B})} = \\overline{A\\overline{B}}$
3. **NAND 3:** $N_3 = \\overline{B \\cdot N_1} = \\overline{B \\cdot \\overline{AB}} = \\overline{\\overline{A}B}$
4. **NAND 4 (Difference $D$):**
   $$D = \\overline{N_2 \\cdot N_3} = \\overline{\\overline{A\\overline{B}} \\cdot \\overline{\\overline{A}B}} = A\\overline{B} + \\overline{A}B = \\mathbf{A \\oplus B}$$
5. **NAND 5 (Borrow $B_{out}$):**
   Invert $N_3$ using a 5th NAND gate:
   $$B_{out} = \\overline{N_3 \\cdot N_3} = \\overline{\\overline{\\overline{A}B}} = \\mathbf{\\overline{A}B}$$

$$\\mathbf{\\text{Total NAND Gates Required} = 5}$$"""
    },
    {
      "question_id": "DCS_2025_MID_Q4A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 2,
      "topic": "4-Variable K-Map Minimization",
      "question": "Minimize the following 4-variable Boolean function using a Karnaugh Map: $$F(A, B, C, D) = \\sum m(2, 8, 12, 14) + \\sum d(3, 5, 6, 10)$$ Express the minimized result in Sum of Products (SOP) form.",
      "marks": 2,
      "reference": "Mano & Ciletti (5th Ed), Chapter 3 (Gate-Level Minimization)",
      "solution_markdown": """### **Step-by-Step K-Map Solution**

#### **1. Plotting Minterms ($1$) and Don't Cares ($d$):**
- Minterms: $m_2 (0010), m_8 (1000), m_{12} (1100), m_{14} (1110)$
- Don't cares: $d_3 (0011), d_5 (0101), d_6 (0110), d_{10} (1010)$

---

#### **2. 4-Variable K-Map Layout ($AB \\times CD$):**

```
CD \\ AB    00    01    11    10
00        0     0     1(m12) 1(m8)
01        0     d(5)  0      0
11        d(3)  0     0      0
10        1(m2) d(6)  1(m14) d(10)
```

---

#### **3. Grouping into Prime Implicants:**
1. **Group 1 (Quad in Row 4 - $CD = 10$):**
   Cells $(m_2, d_6, m_{14}, d_{10})$ at row $C\\overline{D}$.
   Common term: **$C\\overline{D}$**
2. **Group 2 (Quad across Columns $AB = 11, 10$ and Rows $CD = 00, 10$):**
   Cells $(m_{12}, m_8, m_{14}, d_{10})$.
   Common term: **$A\\overline{D}$**

---

#### **4. Minimized Minimal SOP Expression:**
$$F(A, B, C, D) = C\\overline{D} + A\\overline{D} = \\mathbf{\\overline{D}(A + C)}$$"""
    },
    {
      "question_id": "DCS_2025_MID_Q4B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 2,
      "topic": "4-bit BCD Adder Architecture",
      "question": "Draw the block diagram and explain the working of a single-digit (4-bit) BCD Adder. Derive the boolean logic equation for the BCD carry-detection circuit.",
      "marks": 2,
      "reference": "Mano & Ciletti, Chapter 4",
      "solution_markdown": """### **Step-by-Step Architecture & Derivation**

#### **1. BCD Carry Detection Logic Derivation:**
Let the 4-bit binary sum of the first adder stage be $K, Z_3, Z_2, Z_1, Z_0$ (where $K$ is the output carry from MSB adder).
A correction is required if:
1. $K = 1$ (sum $> 15$)
2. Sum is between $10$ and $15$ ($1010_2$ to $1111_2$):
   - $Z_3 Z_2 = 1$ (covers $12, 13, 14, 15$)
   - $Z_3 Z_1 = 1$ (covers $10, 11, 14, 15$)

The BCD output carry $C_{out}$ is:
$$\\mathbf{C_{out} = K + Z_3 Z_2 + Z_3 Z_1}$$

---

#### **2. Architecture Block Diagram:**
1. **Stage 1 (Binary Adder):** Standard 4-bit Binary Full Adder (e.g., IC 7483) adds inputs $A[3:0]$ and $B[3:0]$ with $C_{in}$. Outputs intermediate sum $Z[3:0]$ and carry $K$.
2. **Correction Logic:** Evaluates $C_{out} = K + Z_3 Z_2 + Z_3 Z_1$.
3. **Stage 2 (Correction Adder):** Second 4-bit Binary Adder adds $(0, C_{out}, C_{out}, 0)_2$ to $Z[3:0]$:
   - If $C_{out} = 0$: Adds $(0000)_2$, passing $Z$ through unchanged.
   - If $C_{out} = 1$: Adds $(0110)_2 = +6$, correcting the result into valid BCD."""
    },
    {
      "question_id": "DCS_2025_MID_Q5A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 2,
      "topic": "Multiplexer Tree Implementation (8:1 MUX)",
      "question": "Design an 8:1 Multiplexer using two 4:1 Multiplexers and one 2:1 Multiplexer (or 2-input logic gates). Show the interconnection diagram and function table.",
      "marks": 2,
      "reference": "Mano & Ciletti, Chapter 4 (Multiplexers)",
      "solution_markdown": """### **Step-by-Step Design**

#### **1. Architecture:**
- Inputs: 8 data lines $I_0, I_1, \\dots, I_7$ and 3 select lines $S_2, S_1, S_0$ (where $S_2$ is MSB).
- **MUX 1 (4:1):** Takes lower 4 data inputs $I_0, I_1, I_2, I_3$ with select lines $S_1, S_0$. Output is $Y_1$.
- **MUX 2 (4:1):** Takes upper 4 data inputs $I_4, I_5, I_6, I_7$ with select lines $S_1, S_0$. Output is $Y_2$.
- **MUX 3 (2:1):** Takes $Y_1$ and $Y_2$ as data inputs, with MSB select line $S_2$.
  - When $S_2 = 0 \\implies Y = Y_1$ (routes selected input from $I_0 \\dots I_3$).
  - When $S_2 = 1 \\implies Y = Y_2$ (routes selected input from $I_4 \\dots I_7$).

---

#### **2. Function Table:**

| $S_2$ | $S_1$ | $S_0$ | Selected Output $Y$ |
| :---: | :---: | :---: | :---: |
| 0 | 0 | 0 | $I_0$ |
| 0 | 0 | 1 | $I_1$ |
| 0 | 1 | 0 | $I_2$ |
| 0 | 1 | 1 | $I_3$ |
| 1 | 0 | 0 | $I_4$ |
| 1 | 0 | 1 | $I_5$ |
| 1 | 1 | 0 | $I_6$ |
| 1 | 1 | 1 | $I_7$ |"""
    },
    {
      "question_id": "DCS_2025_MID_Q5B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EAEPC305",
      "unit": 2,
      "topic": "Boolean Function Realization with 8:1 MUX",
      "question": "Implement the following 4-variable Boolean function using an 8:1 Multiplexer: $$F(W, X, Y, Z) = \\sum m(0, 1, 6, 7, 9, 12, 13, 14)$$ Connect variables $W, X, Y$ to select lines $S_2, S_1, S_0$ respectively.",
      "marks": 2,
      "reference": "Mano & Ciletti, Chapter 4",
      "solution_markdown": """### **Step-by-Step Implementation**

Let select lines be $S_2 = W, S_1 = X, S_0 = Y$.
The 4th variable $Z$ is used for data inputs $I_0, I_1, \\dots, I_7$.

---

#### **Input Derivation Table:**

| Select ($WXY$) | Decimal | $Z=0$ Minterm | $Z=1$ Minterm | Function Output $F$ | MUX Input $I_k$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 000 | 0 | $m_0$ (1) | $m_1$ (1) | Both 1 | **$I_0 = 1$** |
| 001 | 1 | $m_2$ (0) | $m_3$ (0) | Both 0 | **$I_1 = 0$** |
| 010 | 2 | $m_4$ (0) | $m_5$ (0) | Both 0 | **$I_2 = 0$** |
| 011 | 3 | $m_6$ (1) | $m_7$ (1) | Both 1 | **$I_3 = 1$** |
| 100 | 4 | $m_8$ (0) | $m_9$ (1) | 1 when $Z=1$ | **$I_4 = Z$** |
| 101 | 5 | $m_{10}$ (0) | $m_{11}$ (0) | Both 0 | **$I_5 = 0$** |
| 110 | 6 | $m_{12}$ (1) | $m_{13}$ (1) | Both 1 | **$I_6 = 1$** |
| 111 | 7 | $m_{14}$ (1) | $m_{15}$ (0) | 1 when $Z=0$ | **$I_7 = \\overline{Z}$** |

---

#### **Final Connections to 8:1 MUX:**
- Select Lines: $S_2 = W, S_1 = X, S_0 = Y$
- Data Inputs:
  $$I_0 = 1, \\quad I_1 = 0, \\quad I_2 = 0, \\quad I_3 = 1$$
  $$I_4 = Z, \\quad I_5 = 0, \\quad I_6 = 1, \\quad I_7 = \\overline{Z}$$"""
    }
]

print("Subject 4 loaded")

# -------------------------------------------------------------
# SUBJECT 5: Mathematics For Machine Learning (EPMTC301)
# -------------------------------------------------------------
sol_dict["05_Mathematics_For_Machine_Learning_EPMTC301"] = [
    {
      "question_id": "MML_2025_MID_Q1A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 1,
      "topic": "Matrix Representation of Linear Transformation",
      "question": "Find the matrix representation of the linear transformation $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$ defined by: $$T(x, y, z) = (2y + z, \\ x - 4y, \\ 3x)$$ with respect to the standard ordered basis of $\\mathbb{R}^3$.",
      "marks": 2,
      "reference": "Gilbert Strang (5th Ed), Chapter 7 (Linear Transformations)",
      "solution_markdown": """### **Step-by-Step Solution**

Let the standard ordered basis for the domain and codomain $\\mathbb{R}^3$ be:
$$B = \\{e_1, e_2, e_3\\} = \\left\\{ \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix}, \\begin{bmatrix} 0 \\\\ 1 \\\\ 0 \\end{bmatrix}, \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix} \\right\\}$$

The linear transformation is given by:
$$T\\left(\\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix}\\right) = \\begin{bmatrix} 2y + z \\\\ x - 4y \\\\ 3x \\end{bmatrix}$$

---

#### **Step 1: Transform each standard basis vector**
1. **For $e_1 = (1, 0, 0)^T$ ($x=1, y=0, z=0$):**
   $$T(e_1) = \\begin{bmatrix} 2(0) + 0 \\\\ 1 - 4(0) \\\\ 3(1) \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 1 \\\\ 3 \\end{bmatrix}$$
2. **For $e_2 = (0, 1, 0)^T$ ($x=0, y=1, z=0$):**
   $$T(e_2) = \\begin{bmatrix} 2(1) + 0 \\\\ 0 - 4(1) \\\\ 3(0) \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ -4 \\\\ 0 \\end{bmatrix}$$
3. **For $e_3 = (0, 0, 1)^T$ ($x=0, y=0, z=1$):**
   $$T(e_3) = \\begin{bmatrix} 2(0) + 1 \\\\ 0 - 4(0) \\\\ 3(0) \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix}$$

---

#### **Step 2: Construct the Transformation Matrix $[T]_B$**
Placing the transformed vectors as columns of matrix $[T]$:
$$[T]_B = \\begin{bmatrix} | & | & | \\\\ T(e_1) & T(e_2) & T(e_3) \\\\ | & | & | \\end{bmatrix} = \\mathbf{\\begin{bmatrix} 0 & 2 & 1 \\\\ 1 & -4 & 0 \\\\ 3 & 0 & 0 \\end{bmatrix}}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q1B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 1,
      "topic": "Vector Subspace Verification",
      "question": "Examine whether the subset $W = \\{(x, y, z) \\in \\mathbb{R}^3 : x = z + 2\\}$ forms a subspace of the vector space $\\mathbb{R}^3$.",
      "marks": 2,
      "reference": "Gilbert Strang (5th Ed), Chapter 3 (Vector Spaces and Subspaces)",
      "solution_markdown": """### **Step-by-Step Verification**

A non-empty subset $W \\subseteq V$ is a valid vector subspace of $V$ if and only if it satisfies three essential closure axioms:
1. **Zero Vector Containment:** $\\mathbf{0} = (0, 0, 0) \\in W$
2. **Closure under Addition:** If $\\mathbf{u}, \\mathbf{v} \\in W \\implies \\mathbf{u} + \\mathbf{v} \\in W$
3. **Closure under Scalar Multiplication:** If $\\mathbf{u} \\in W, c \\in \\mathbb{R} \\implies c\\mathbf{u} \\in W$

---

#### **Test 1: Zero Vector Verification**
For the zero vector $\\mathbf{0} = (0, 0, 0)$, we have $x = 0$ and $z = 0$.
Evaluating the defining constraint equation $x = z + 2$:
$$0 \\stackrel{?}{=} 0 + 2 \\implies 0 \\neq 2$$
Since $(0, 0, 0)$ does not satisfy the constraint:
$$\\mathbf{0} \\notin W$$

---

#### **Conclusion:**
Because $W$ fails the zero vector condition (it represents an affine plane not passing through the origin):
$$\\mathbf{W \\text{ is NOT a subspace of } \\mathbb{R}^3.}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q2A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 1,
      "topic": "Linear Mapping on Basis Vectors",
      "question": "A linear transformation $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$ satisfies $T(2, 1, 1) = (1, 1, 1)$, $T(1, 2, 1) = (1, 1, 1)$, and $T(1, 1, 2) = (1, 1, 1)$. Find the general formula for $T(x, y, z)$.",
      "marks": 2,
      "reference": "Gilbert Strang, Chapter 7",
      "solution_markdown": """### **Step-by-Step Solution**

Let $v_1 = (2, 1, 1), v_2 = (1, 2, 1), v_3 = (1, 1, 2)$.
We express any arbitrary vector $(x, y, z) \\in \\mathbb{R}^3$ as a linear combination of basis vectors:
$$(x, y, z) = c_1(2, 1, 1) + c_2(1, 2, 1) + c_3(1, 1, 2)$$

---

#### **Step 1: Solve for coefficients $c_1, c_2, c_3$**
$$\\begin{cases}
2c_1 + c_2 + c_3 = x \\\\
c_1 + 2c_2 + c_3 = y \\\\
c_1 + c_2 + 2c_3 = z
\\end{cases}$$
Adding all three equations:
$$4(c_1 + c_2 + c_3) = x + y + z \\implies c_1 + c_2 + c_3 = \\frac{x + y + z}{4}$$

---

#### **Step 2: Apply Linearity of $T$**
$$T(x, y, z) = c_1 T(v_1) + c_2 T(v_2) + c_3 T(v_3) = (c_1 + c_2 + c_3) (1, 1, 1)$$
Substituting $c_1 + c_2 + c_3 = \\frac{x + y + z}{4}$:
$$\\mathbf{T(x, y, z) = \\left( \\frac{x + y + z}{4}, \\frac{x + y + z}{4}, \\frac{x + y + z}{4} \\right)}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q2B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 1,
      "topic": "Linear Independence of Vectors",
      "question": "Determine whether the set of vectors $S = \\{(1, 3, 2), (1, -7, -8), (2, 1, -1)\\}$ in $\\mathbb{R}^3$ is linearly independent or linearly dependent. If dependent, find the linear relation.",
      "marks": 2,
      "reference": "Gilbert Strang (5th Ed), Chapter 3",
      "solution_markdown": """### **Step-by-Step Solution**

Let $v_1 = (1, 3, 2)^T, v_2 = (1, -7, -8)^T, v_3 = (2, 1, -1)^T$.
Form the matrix $A = [v_1 \\ v_2 \\ v_3]$:
$$A = \\begin{bmatrix} 1 & 1 & 2 \\\\ 3 & -7 & 1 \\\\ 2 & -8 & -1 \\end{bmatrix}$$

---

#### **Step 1: Gaussian Row Reduction**
1. Row operations: $R_2 \\leftarrow R_2 - 3R_1$ and $R_3 \\leftarrow R_3 - 2R_1$:
   $$\\begin{bmatrix} 1 & 1 & 2 \\\\ 0 & -10 & -5 \\\\ 0 & -10 & -5 \\end{bmatrix}$$
2. Row operation: $R_3 \\leftarrow R_3 - R_2$:
   $$\\begin{bmatrix} 1 & 1 & 2 \\\\ 0 & -10 & -5 \\\\ 0 & 0 & 0 \\end{bmatrix}$$

---

#### **Step 2: Conclusion & Dependency Relation**
Since $\\text{Rank}(A) = 2 < 3$, the system has a non-trivial nullspace:
$$\\mathbf{\\text{The set } S \\text{ is LINEARLY DEPENDENT.}}$$

From row 2: $-10 c_2 - 5 c_3 = 0 \\implies c_3 = -2 c_2$.
Setting $c_2 = 1 \\implies c_3 = -2$.
From row 1: $c_1 + (1) + 2(-2) = 0 \\implies c_1 = 3$.
$$\\mathbf{3 v_1 + 1 v_2 - 2 v_3 = 0}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q3A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 1,
      "topic": "Range Space and Basis",
      "question": "The linear transformation $T: \\mathcal{P}_2(\\mathbb{R}) \\to \\mathcal{M}_{2\\times 2}(\\mathbb{R})$ is defined by: $$T(f(x)) = \\begin{bmatrix} f(0) & 2f'(0) \\\\ 0 & f''(0) \\end{bmatrix}$$ Find a basis and the dimension of the Range space $\\text{Range}(T)$.",
      "marks": 2,
      "reference": "Gilbert Strang, Chapter 7",
      "solution_markdown": """### **Step-by-Step Solution**

Let the standard basis of polynomial space $\\mathcal{P}_2(\\mathbb{R})$ be $B = \\{1, x, x^2\\}$.
Any polynomial is $f(x) = a_0 + a_1 x + a_2 x^2$.
- $f(0) = a_0$
- $f'(x) = a_1 + 2a_2 x \\implies f'(0) = a_1 \\implies 2f'(0) = 2a_1$
- $f''(x) = 2a_2 \\implies f''(0) = 2a_2$

---

#### **Step 1: Transform Basis Polynomials**
- $T(1) = \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\end{bmatrix}$ (for $a_0=1, a_1=0, a_2=0$)
- $T(x) = \\begin{bmatrix} 0 & 2 \\\\ 0 & 0 \\end{bmatrix}$ (for $a_0=0, a_1=1, a_2=0$)
- $T(x^2) = \\begin{bmatrix} 0 & 0 \\\\ 0 & 2 \\end{bmatrix}$ (for $a_0=0, a_1=0, a_2=1$)

---

#### **Step 2: Basis and Dimension of Range Space**
These three output matrices are linearly independent upper triangular matrices.
$$\\mathbf{\\text{Basis of } \\text{Range}(T) = \\left\\{ \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\end{bmatrix}, \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}, \\begin{bmatrix} 0 & 0 \\\\ 0 & 1 \\end{bmatrix} \\right\\}}$$
$$\\mathbf{\\dim(\\text{Range}(T)) = 3}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q3B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 2,
      "topic": "Inner Product and Vector Orthogonality",
      "question": "Let $u = (1, 3)$ and $v = (2, 1) \\in \\mathbb{R}^2$. Find a vector $w \\in \\mathbb{R}^2$ such that $\\langle w, u \\rangle = 3$ and $\\langle w, v \\rangle = -1$, where $\\langle \\cdot, \\cdot \\rangle$ is the standard Euclidean inner product on $\\mathbb{R}^2$.",
      "marks": 2,
      "reference": "Gilbert Strang (5th Ed), Chapter 4 (Orthogonality)",
      "solution_markdown": """### **Step-by-Step Solution**

Let $w = (w_1, w_2) \\in \\mathbb{R}^2$.
Using the standard Euclidean inner product $\\langle w, x \\rangle = w_1 x_1 + w_2 x_2$:

1. **First Condition $\\langle w, u \\rangle = 3$:**
   $$\\langle (w_1, w_2), (1, 3) \\rangle = w_1(1) + w_2(3) = 3 \\implies w_1 + 3w_2 = 3 \\quad \\text{--- (Eq. 1)}$$
2. **Second Condition $\\langle w, v \\rangle = -1$:**
   $$\\langle (w_1, w_2), (2, 1) \\rangle = w_1(2) + w_2(1) = -1 \\implies 2w_1 + w_2 = -1 \\quad \\text{--- (Eq. 2)}$$

---

#### **Solving the System of Linear Equations:**
From Eq. 1: $w_1 = 3 - 3w_2$.
Substitute into Eq. 2:
$$2(3 - 3w_2) + w_2 = -1 \\implies 6 - 6w_2 + w_2 = -1 \\implies -5w_2 = -7 \\implies \\mathbf{w_2 = \\frac{7}{5}}$$
Find $w_1$:
$$w_1 = 3 - 3\\left(\\frac{7}{5}\\right) = \\frac{15 - 21}{5} = \\mathbf{-\\frac{6}{5}}$$

$$\\mathbf{w = \\left( -\\frac{6}{5}, \\frac{7}{5} \\right) = (-1.2, 1.4)}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q4A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 2,
      "topic": "Definiteness of Quadratic Forms",
      "question": "Discuss the nature (definiteness) of the quadratic form: $$Q(x, y, z) = x^2 + 2y^2$$ on $\\mathbb{R}^3$.",
      "marks": 2,
      "reference": "Gilbert Strang, Chapter 6 (Positive Definite Matrices)",
      "solution_markdown": """### **Step-by-Step Solution**

The quadratic form on $\\mathbb{R}^3$ is given by:
$$Q(x, y, z) = 1 \\cdot x^2 + 2 \\cdot y^2 + 0 \\cdot z^2$$

---

#### **Method 1: Matrix Representation & Eigenvalues**
The symmetric matrix $A$ associated with $Q(x, y, z) = \\mathbf{x}^T A \\mathbf{x}$ is:
$$A = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}$$
The eigenvalues of the diagonal matrix $A$ are:
$$\\lambda_1 = 1 > 0, \\quad \\lambda_2 = 2 > 0, \\quad \\lambda_3 = 0$$

---

#### **Method 2: Definiteness Test**
- Since all eigenvalues are $\\ge 0$ (two positive and one zero):
  $$Q(x, y, z) = x^2 + 2y^2 \\ge 0 \\quad \\forall (x, y, z) \\in \\mathbb{R}^3$$
- However, for any non-zero vector along the $z$-axis of the form $(0, 0, z_0)$ where $z_0 \\neq 0$:
  $$Q(0, 0, z_0) = 0^2 + 2(0)^2 = 0$$
$$\\mathbf{Q(x, y, z) \\text{ is POSITIVE SEMI-DEFINITE (PSD).}}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q4B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 2,
      "topic": "Eigenvalue Product Property & Determinant",
      "question": "The product of two eigenvalues of the matrix $$A = \\begin{bmatrix} 6 & -2 & 2 \\\\ -2 & 3 & -1 \\\\ 2 & -1 & 3 \\end{bmatrix}$$ is 16. Find the third eigenvalue.",
      "marks": 2,
      "reference": "Gilbert Strang (5th Ed), Chapter 6 (Eigenvalues and Eigenvectors)",
      "solution_markdown": """### **Step-by-Step Solution**

Let the three eigenvalues of $A$ be $\\lambda_1, \\lambda_2, \\lambda_3$.

#### **Theorem:**
The product of all eigenvalues of any square matrix equals its determinant:
$$\\det(A) = \\lambda_1 \\cdot \\lambda_2 \\cdot \\lambda_3$$

---

#### **Step 1: Compute the Determinant $\\det(A)$**
Expand along the first row:
$$\\det(A) = 6 \\begin{vmatrix} 3 & -1 \\\\ -1 & 3 \\end{vmatrix} - (-2) \\begin{vmatrix} -2 & -1 \\\\ 2 & 3 \\end{vmatrix} + 2 \\begin{vmatrix} -2 & 3 \\\\ 2 & -1 \\end{vmatrix}$$
1. $6 \\big( (3)(3) - (-1)(-1) \\big) = 6(9 - 1) = 6(8) = 48$
2. $+2 \\big( (-2)(3) - (-1)(2) \\big) = +2(-6 + 2) = 2(-4) = -8$
3. $+2 \\big( (-2)(-1) - (3)(2) \\big) = +2(2 - 6) = 2(-4) = -8$

$$\\det(A) = 48 - 8 - 8 = \\mathbf{32}$$

---

#### **Step 2: Solve for the third eigenvalue $\\lambda_3$**
Given $\\lambda_1 \\cdot \\lambda_2 = 16$:
$$\\lambda_1 \\cdot \\lambda_2 \\cdot \\lambda_3 = 32 \\implies 16 \\cdot \\lambda_3 = 32 \\implies \\mathbf{\\lambda_3 = \\frac{32}{16} = 2}$$"""
    },
    {
      "question_id": "MML_2025_MID_Q5A",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 2,
      "topic": "Gram-Schmidt Orthonormalization Process",
      "question": "Using the Gram-Schmidt process, convert the basis $\\{v_1, v_2, v_3\\} = \\{(1, 1, 1), (0, 1, 1), (0, 0, 1)\\}$ of the Euclidean space $\\mathbb{R}^3$ into an orthogonal and orthonormal basis under the standard inner product.",
      "marks": 2,
      "reference": "Gilbert Strang (5th Ed), Chapter 4 (Orthogonal Bases and Gram-Schmidt)",
      "solution_markdown": """### **Step-by-Step Solution**

Given initial basis:
$$v_1 = (1, 1, 1), \\quad v_2 = (0, 1, 1), \\quad v_3 = (0, 0, 1)$$

---

#### **Step 1: First Orthogonal Vector $u_1$**
$$u_1 = v_1 = \\mathbf{(1, 1, 1)}$$
$$\\|u_1\\|^2 = 1^2 + 1^2 + 1^2 = 3$$

---

#### **Step 2: Second Orthogonal Vector $u_2$**
$$u_2 = v_2 - \\frac{\\langle v_2, u_1 \\rangle}{\\|u_1\\|^2} u_1$$
$$\\langle v_2, u_1 \\rangle = (0)(1) + (1)(1) + (1)(1) = 2$$
$$u_2 = (0, 1, 1) - \\frac{2}{3}(1, 1, 1) = \\mathbf{\\left( -\\frac{2}{3}, \\frac{1}{3}, \\frac{1}{3} \\right)}$$
$$\\|u_2\\|^2 = \\left(-\\frac{2}{3}\\right)^2 + \\left(\\frac{1}{3}\\right)^2 + \\left(\\frac{1}{3}\\right)^2 = \\frac{4 + 1 + 1}{9} = \\frac{6}{9} = \\frac{2}{3}$$

---

#### **Step 3: Third Orthogonal Vector $u_3$**
$$u_3 = v_3 - \\frac{\\langle v_3, u_1 \\rangle}{\\|u_1\\|^2} u_1 - \\frac{\\langle v_3, u_2 \\rangle}{\\|u_2\\|^2} u_2$$
- $\\langle v_3, u_1 \\rangle = (0)(1) + (0)(1) + (1)(1) = 1$
- $\\langle v_3, u_2 \\rangle = (0)(-2/3) + (0)(1/3) + (1)(1/3) = 1/3$
$$u_3 = (0, 0, 1) - \\frac{1}{3}(1, 1, 1) - \\frac{1/3}{2/3}\\left(-\\frac{2}{3}, \\frac{1}{3}, \\frac{1}{3}\\right)$$
$$u_3 = (0, 0, 1) - \\left(\\frac{1}{3}, \\frac{1}{3}, \\frac{1}{3}\\right) - \\left(-\\frac{1}{3}, \\frac{1}{6}, \\frac{1}{6}\\right) = \\mathbf{\\left( 0, -\\frac{1}{2}, \\frac{1}{2} \\right)}$$
$$\\|u_3\\|^2 = 0 + \\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}$$

---

#### **Step 4: Orthonormal Basis $\\{e_1, e_2, e_3\\}$**
- $e_1 = \\frac{u_1}{\\|u_1\\|} = \\mathbf{\\frac{1}{\\sqrt{3}}(1, 1, 1)}$
- $e_2 = \\frac{u_2}{\\|u_2\\|} = \\mathbf{\\frac{1}{\\sqrt{6}}(-2, 1, 1)}$
- $e_3 = \\frac{u_3}{\\|u_3\\|} = \\mathbf{\\frac{1}{\\sqrt{2}}(0, -1, 1)}$"""
    },
    {
      "question_id": "MML_2025_MID_Q5B",
      "exam": "2025 Mid-Semester",
      "exam_type": "Mid_Semester",
      "subject_code": "EPMTC301",
      "unit": 2,
      "topic": "Orthogonal Basis Verification & Normalization",
      "question": "Show that the set $S = \\{(2, -1, 3), (-1, 1, 1), (-4, -5, 1)\\}$ is an orthogonal basis of $\\mathbb{R}^3$. Find its orthonormal basis.",
      "marks": 2,
      "reference": "Gilbert Strang, Chapter 4",
      "solution_markdown": """### **Step-by-Step Solution**

Let $v_1 = (2, -1, 3), v_2 = (-1, 1, 1), v_3 = (-4, -5, 1)$.

---

#### **Step 1: Check Pairwise Orthogonality**
1. $\\langle v_1, v_2 \\rangle = (2)(-1) + (-1)(1) + (3)(1) = -2 - 1 + 3 = \\mathbf{0}$
2. $\\langle v_1, v_3 \\rangle = (2)(-4) + (-1)(-5) + (3)(1) = -8 + 5 + 3 = \\mathbf{0}$
3. $\\langle v_2, v_3 \\rangle = (-1)(-4) + (1)(-5) + (1)(1) = 4 - 5 + 1 = \\mathbf{0}$

Since all pairwise inner products are zero, the vectors are mutually orthogonal.
Non-zero orthogonal vectors are linearly independent. Since there are 3 linearly independent vectors in $\\mathbb{R}^3$, $S$ forms an **orthogonal basis** of $\\mathbb{R}^3$.

---

#### **Step 2: Compute Norms & Normalize**
- $\\|v_1\\| = \\sqrt{2^2 + (-1)^2 + 3^2} = \\sqrt{4 + 1 + 9} = \\sqrt{14}$
- $\\|v_2\\| = \\sqrt{(-1)^2 + 1^2 + 1^2} = \\sqrt{1 + 1 + 1} = \\sqrt{3}$
- $\\|v_3\\| = \\sqrt{(-4)^2 + (-5)^2 + 1^2} = \\sqrt{16 + 25 + 1} = \\sqrt{42}$

$$\\mathbf{\\text{Orthonormal Basis } = \\left\\{ \\frac{1}{\\sqrt{14}}(2, -1, 3), \\ \\frac{1}{\\sqrt{3}}(-1, 1, 1), \\ \\frac{1}{\\sqrt{42}}(-4, -5, 1) \\right\\}}$$"""
    }
]

# Write to output JSON file
all_solutions = {}
for sub_id, q_list in sol_dict.items():
    for q in q_list:
        q["question_hash"] = compute_q_hash(q["question"])
    all_solutions[sub_id] = q_list

out_path = Path("web/public/solutions.json")
out_path.parent.mkdir(parents=True, exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump({
        "metadata": {
            "version": "2.0.0",
            "total_solutions": sum(len(v) for v in all_solutions.values()),
            "curator": "Antigravity Academic Engine"
        },
        "solutions": all_solutions
    }, f, indent=2)

print(f"SUCCESS: Saved {sum(len(v) for v in all_solutions.values())} complete parsed Mid-Sem solutions to {out_path}")
