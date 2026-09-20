# Problem Sheet 3 Companion: Gram-Schmidt & Orthogonal Diagonalization

This practice set directly matches **EPMTC301 Problem Sheet 3** (Eigenvalues, Eigenvectors, Inner Products, and Gram-Schmidt).

---

## 📌 Problem 1: Gram-Schmidt Process on Function Spaces ($\mathcal{P}_2(\mathbb{R})$)

### Problem Statement
Let $\mathcal{P}_2(\mathbb{R})$ be the real inner product space of polynomials of degree $\le 2$ equipped with the integral inner product:
$$\langle p, q \rangle = \int_{-1}^{1} p(x)q(x)\,dx$$
Starting from the standard basis $\{1, x, x^2\}$, use the **Gram-Schmidt process** to construct an **orthonormal basis** $\{e_0(x), e_1(x), e_2(x)\}$.

### Step-by-Step Solution

1. **Step 1: First orthogonal vector $u_0(x)$**
   $$u_0(x) = 1$$
   Compute $\|u_0\|^2$:
   $$\|u_0\|^2 = \int_{-1}^1 1^2\,dx = 2 \implies \|u_0\| = \sqrt{2}$$
   $$e_0(x) = \frac{1}{\sqrt{2}}$$

2. **Step 2: Second orthogonal vector $u_1(x)$**
   $$u_1(x) = x - \frac{\langle x, u_0 \rangle}{\|u_0\|^2} u_0$$
   $$\langle x, 1 \rangle = \int_{-1}^1 x\,dx = 0$$
   Therefore:
   $$u_1(x) = x$$
   Compute $\|u_1\|^2$:
   $$\|u_1\|^2 = \int_{-1}^1 x^2\,dx = \left[\frac{x^3}{3}\right]_{-1}^1 = \frac{2}{3} \implies \|u_1\| = \sqrt{\frac{2}{3}}$$
   $$e_1(x) = \sqrt{\frac{3}{2}} x$$

3. **Step 3: Third orthogonal vector $u_2(x)$**
   $$u_2(x) = x^2 - \frac{\langle x^2, u_0 \rangle}{\|u_0\|^2} u_0 - \frac{\langle x^2, u_1 \rangle}{\|u_1\|^2} u_1$$
   - $\langle x^2, u_0 \rangle = \int_{-1}^1 x^2\,dx = \frac{2}{3}$
   - $\langle x^2, u_1 \rangle = \int_{-1}^1 x^3\,dx = 0$ (odd integrand over symmetric interval)
   $$u_2(x) = x^2 - \frac{2/3}{2}(1) - 0 = x^2 - \frac{1}{3}$$
   Compute $\|u_2\|^2$:
   $$\|u_2\|^2 = \int_{-1}^1 \left(x^2 - \frac{1}{3}\right)^2 dx = \int_{-1}^1 \left(x^4 - \frac{2}{3}x^2 + \frac{1}{9}\right) dx = 2\left(\frac{1}{5} - \frac{2}{9} + \frac{1}{9}\right) = 2\left(\frac{1}{5} - \frac{1}{9}\right) = \frac{8}{45}$$
   $$\|u_2\| = \sqrt{\frac{8}{45}} = \frac{2\sqrt{2}}{3\sqrt{5}}$$
   $$e_2(x) = \frac{3\sqrt{5}}{2\sqrt{2}}\left(x^2 - \frac{1}{3}\right) = \frac{\sqrt{10}}{4}(3x^2 - 1)$$

---

## 📌 Problem 2: Gram-Schmidt in $\mathbb{R}^4$ & Orthogonal Projection

### Problem Statement
In $\mathbb{R}^4$ with the standard dot product, find an orthonormal basis for the subspace $W = \operatorname{span}\{v_1, v_2\}$ where:
$$v_1 = (1, 1, 1, 1)^T, \quad v_2 = (1, 2, 4, 5)^T$$
Then, compute the orthogonal projection $\operatorname{proj}_W(y)$ of $y = (1, 0, 0, 0)^T$ onto $W$.

### Step-by-Step Solution

1. **Step 1: Compute $u_1$ and $e_1$**
   $$u_1 = v_1 = (1, 1, 1, 1)^T, \quad \|u_1\|^2 = 1+1+1+1 = 4$$
   $$e_1 = \frac{1}{2}(1, 1, 1, 1)^T$$

2. **Step 2: Compute $u_2$ and $e_2$**
   $$\langle v_2, u_1 \rangle = 1(1) + 2(1) + 4(1) + 5(1) = 12$$
   $$u_2 = v_2 - \frac{\langle v_2, u_1 \rangle}{\|u_1\|^2} u_1 = \begin{pmatrix} 1 \\ 2 \\ 4 \\ 5 \end{pmatrix} - \frac{12}{4}\begin{pmatrix} 1 \\ 1 \\ 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 1-3 \\ 2-3 \\ 4-3 \\ 5-3 \end{pmatrix} = \begin{pmatrix} -2 \\ -1 \\ 1 \\ 2 \end{pmatrix}$$
   $$\|u_2\|^2 = (-2)^2 + (-1)^2 + 1^2 + 2^2 = 4 + 1 + 1 + 4 = 10 \implies \|u_2\| = \sqrt{10}$$
   $$e_2 = \frac{1}{\sqrt{10}}(-2, -1, 1, 2)^T$$

3. **Step 3: Orthogonal Projection $\operatorname{proj}_W(y)$**
   $$\operatorname{proj}_W(y) = \langle y, e_1 \rangle e_1 + \langle y, e_2 \rangle e_2$$
   - $\langle y, e_1 \rangle = (1)\left(\frac{1}{2}\right) = \frac{1}{2}$
   - $\langle y, e_2 \rangle = (1)\left(-\frac{2}{\sqrt{10}}\right) = -\frac{2}{\sqrt{10}}$
   $$\operatorname{proj}_W(y) = \frac{1}{2}\left[\frac{1}{2}\begin{pmatrix}1\\1\\1\\1\end{pmatrix}\right] - \frac{2}{\sqrt{10}}\left[\frac{1}{\sqrt{10}}\begin{pmatrix}-2\\-1\\1\\2\end{pmatrix}\right] = \frac{1}{4}\begin{pmatrix}1\\1\\1\\1\end{pmatrix} - \frac{2}{10}\begin{pmatrix}-2\\-1\\1\\2\end{pmatrix}$$
   $$= \begin{pmatrix} 1/4 + 2/5 \\ 1/4 + 1/5 \\ 1/4 - 1/5 \\ 1/4 - 2/5 \end{pmatrix} = \begin{pmatrix} 13/20 \\ 9/20 \\ 1/20 \\ -3/20 \end{pmatrix}$$

---

## 📌 Problem 3: Eigenvalues & Diagonalization of Linear Operators on $\mathcal{P}_n$

### Problem Statement
Let $T: \mathcal{P}_2(\mathbb{R}) \to \mathcal{P}_2(\mathbb{R})$ be defined by:
$$T(p(x)) = (x+1)p'(x) + p''(x)$$
1. Find the matrix representation $[T]_B$ with respect to the standard basis $B = \{1, x, x^2\}$.
2. Find the eigenvalues and corresponding eigenfunctions of $T$.
3. Is $T$ diagonalizable?

### Step-by-Step Solution
1. **Matrix Representation**:
   - $T(1) = 0 = 0(1) + 0(x) + 0(x^2) \implies [T(1)]_B = (0, 0, 0)^T$
   - $T(x) = (x+1)(1) + 0 = 1 + x \implies [T(x)]_B = (1, 1, 0)^T$
   - $T(x^2) = (x+1)(2x) + 2 = 2 + 2x + 2x^2 \implies [T(x^2)]_B = (2, 2, 2)^T$
   $$[T]_B = \begin{pmatrix} 0 & 1 & 2 \\ 0 & 1 & 2 \\ 0 & 0 & 2 \end{pmatrix}$$

2. **Eigenvalues**:
   Since $[T]_B$ is upper triangular, the eigenvalues are the diagonal entries:
   $$\lambda_1 = 0, \quad \lambda_2 = 1, \quad \lambda_3 = 2$$

3. **Diagonalizability**:
   Since $[T]_B$ is a $3 \times 3$ matrix with $3$ distinct real eigenvalues ($0, 1, 2$), $T$ is **guaranteed to be diagonalizable**.
