# UC Davis — MAT 67: Modern Abstract Linear Algebra
## Practice Exam & Topic Review: Kernel, Image, and Invertibility Proofs

**Instructor Reference:** Prof. R. Casals (UC Davis Mathematics)  
**Topics:** Abstract linear maps, null space (kernel), range (image), linear independence in function spaces, and invertibility.

---

### Problem 1: Dimension of Kernel and Basis
Let $T: P_3(\mathbb{R}) \to \mathbb{R}^2$ be the linear map defined by:
$$T(p(x)) = (p(1), p'(1))$$
1. Find a basis for $\ker(T)$ and determine its dimension.
   * **Solution:** $p(x) \in \ker(T) \iff p(1) = 0$ and $p'(1) = 0$.
   * A polynomial has $p(1) = 0$ and $p'(1) = 0$ if and only if $(x-1)^2$ divides $p(x)$.
   * Since $p(x) \in P_3(\mathbb{R})$ (degree $\le 3$), $p(x) = (x-1)^2(ax + b) = a(x-1)^2 x + b(x-1)^2$.
   * A basis for $\ker(T)$ is:
     $$\mathcal{B}_{\ker} = \{ (x-1)^2, x(x-1)^2 \}$$
   * Thus, $\dim(\ker T) = 2$.
2. By the Rank-Nullity Theorem, compute $\dim(\operatorname{im} T)$:
   $$\dim(P_3(\mathbb{R})) = \dim(\ker T) + \dim(\operatorname{im} T) \implies 4 = 2 + \dim(\operatorname{im} T) \implies \dim(\operatorname{im} T) = 2$$
   Since $\operatorname{im}(T) \subseteq \mathbb{R}^2$ and $\dim(\operatorname{im} T) = 2$, $T$ is **surjective**.

---

### Problem 2: Linear Independence in Function Spaces (Set 2 Q2 Style)
Let $f_1(x) = e^x$ and $f_2(x) = e^{-x}$ be elements of the vector space $C^\infty(\mathbb{R})$.
Prove that $\{f_1, f_2\}$ is linearly independent over $\mathbb{R}$.

* **Method 1 (Wronskian Determinant):**
  $$W(f_1, f_2)(x) = \begin{vmatrix} e^x & e^{-x} \\ e^x & -e^{-x} \end{vmatrix} = e^x(-e^{-x}) - e^{-x}(e^x) = -1 - 1 = -2 \neq 0$$
  Since the Wronskian is non-zero everywhere, $\{e^x, e^{-x}\}$ is linearly independent.

* **Method 2 (Direct Value Evaluation — Algebraic Proof):**
  Suppose $c_1 e^x + c_2 e^{-x} = 0$ for all $x \in \mathbb{R}$.
  * At $x = 0$: $c_1(1) + c_2(1) = 0 \implies c_1 + c_2 = 0 \implies c_2 = -c_1$.
  * At $x = 1$: $c_1 e + c_2 e^{-1} = 0 \implies c_1 e - c_1 e^{-1} = 0 \implies c_1 (e - e^{-1}) = 0$.
  * Since $e - e^{-1} \approx 2.718 - 0.368 \neq 0$, we must have $c_1 = 0$.
  * Then $c_2 = -c_1 = 0$.
  * Since $c_1 = c_2 = 0$ is the only solution, $\{e^x, e^{-x}\}$ is linearly independent.
