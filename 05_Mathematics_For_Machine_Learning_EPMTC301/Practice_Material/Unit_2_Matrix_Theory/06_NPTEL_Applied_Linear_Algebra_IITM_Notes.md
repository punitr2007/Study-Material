# NPTEL — Applied Linear Algebra (IIT Madras)
**Instructor:** Prof. Andrew Thangaraj (Department of Electrical Engineering, IIT Madras)  
**Course Code:** noc22_ee02 / 111106137

---

## 📚 Unit-II Topics & Core Theoretical Summaries

### 1. Inner Product Spaces & Norms (Week 7)
- **Inner Product Definition:** An inner product $\langle u, v \rangle$ on vector space $V$ over $\mathbb{R}$ satisfies:
  1. Positivity: $\langle v, v \rangle \ge 0$, and $\langle v, v \rangle = 0 \iff v = 0$.
  2. Linearity in first argument: $\langle au + bw, v \rangle = a\langle u, v \rangle + b\langle w, v \rangle$.
  3. Conjugate / Symmetric symmetry: $\langle u, v \rangle = \langle v, u \rangle$.
- **Induced Norm:** $\|v\| = \sqrt{\langle v, v \rangle}$.
- **Cauchy-Schwarz Inequality:** $|\langle u, v \rangle| \le \|u\| \|v\|$.
- **Triangle Inequality:** $\|u + v\| \le \|u\| + \|v\|$.

### 2. Orthogonality & Projection (Week 8)
- **Orthogonal Subspaces:** $U \perp W \iff \langle u, w \rangle = 0 \; \forall u \in U, w \in W$.
- **Orthogonal Complement:** $V = W \oplus W^\perp$.
- **Projection Theorem:** If $\{e_1, \dots, e_k\}$ is an orthonormal basis of $W$, the projection operator $P_W: V \to W$ is:
  $$P_W(v) = \sum_{i=1}^k \langle v, e_i \rangle e_i$$
- **Least Squares:** For inconsistent system $Ax = b$, the normal equations are $A^T A x = A^T b$.

### 3. Self-Adjoint & Positive Operators (Weeks 10 & 11)
- **Adjoint Operator:** $T^*: V \to V$ defined by $\langle Tv, w \rangle = \langle v, T^*w \rangle$.
- **Self-Adjoint (Hermitian / Symmetric):** $T = T^*$. In standard basis, matrix $A = A^T$.
- **Spectral Theorem for Symmetric Matrices:** Every real symmetric matrix has real eigenvalues and an orthonormal basis of eigenvectors.
- **Positive Definite Operator ($T > 0$):**
  - $\langle Tv, v \rangle > 0$ for all $v \neq 0$.
  - All eigenvalues $\lambda_i > 0$.
  - All leading principal minors $\Delta_k > 0$ (Sylvester's criterion).
  - Matrix can be factored as $A = R^T R$ (Cholesky factorization).
