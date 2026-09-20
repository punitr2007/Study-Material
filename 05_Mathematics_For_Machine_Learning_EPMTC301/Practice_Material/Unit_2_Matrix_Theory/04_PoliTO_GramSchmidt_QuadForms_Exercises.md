# Politecnico di Torino (PoliTO) — Linear Algebra & Geometry (LAG)
## Practice Worksheet: Gram-Schmidt, Quadratic Forms & Orthogonal Diagonalization

**Course:** Linear Algebra and Geometry (LAG / LAG24)  
**Instructor Reference:** Prof. Ada Boralevi (Politecnico di Torino)  
**Topics:** Gram-Schmidt Orthogonalization in $\mathbb{R}^n$, Symmetric Matrices, Quadratic Forms, Sylvester's Criterion, and Orthogonal Diagonalization.

---

### 🔷 PART 1: The Gram-Schmidt Orthonormalization Process

#### Problem 1.1 (Standard $\mathbb{R}^3$ Orthonormalization)
Let $v_1 = (1, 1, 0)$, $v_2 = (1, 2, 1)$, and $v_3 = (0, 1, 2)$ be vectors in $\mathbb{R}^3$ equipped with the standard dot product.
1. Show that $\{v_1, v_2, v_3\}$ is a basis of $\mathbb{R}^3$.
2. Apply the Gram-Schmidt process to transform $\{v_1, v_2, v_3\}$ into an orthogonal basis $\{u_1, u_2, u_3\}$.
3. Normalize the vectors to obtain an orthonormal basis $\{q_1, q_2, q_3\}$.

#### Problem 1.2 (Subspace of $\mathbb{R}^4$)
Let $W \subset \mathbb{R}^4$ be the subspace spanned by $w_1 = (1, 0, 1, 0)$ and $w_2 = (1, 1, 1, 1)$.
1. Find an orthonormal basis for $W$.
2. Find the orthogonal projection of $x = (1, 2, 3, 4)$ onto $W$.
3. Compute the distance from $x$ to the subspace $W$.

---

### 🔷 PART 2: Symmetric Matrices & Orthogonal Diagonalization

#### Problem 2.1 (Spectral Theorem Application)
Consider the symmetric matrix:
$$A = \begin{pmatrix} 2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2 \end{pmatrix}$$
1. Find the eigenvalues of $A$ and their algebraic multiplicities.
2. For each eigenspace, find an orthonormal basis.
3. Construct an orthogonal matrix $Q$ (such that $Q^T = Q^{-1}$) and a diagonal matrix $D$ such that $A = Q D Q^T$.

---

### 🔷 PART 3: Quadratic Forms & Positive Definite Matrices

#### Problem 3.1 (Matrix Representation & Classification)
Let $q: \mathbb{R}^3 \to \mathbb{R}$ be the quadratic form defined by:
$$q(x_1, x_2, x_3) = 2x_1^2 + 2x_2^2 + 2x_3^2 + 2x_1x_2 + 2x_1x_3 + 2x_2x_3$$
1. Write the symmetric matrix $A$ representing $q$.
2. Compute the principal minors of $A$ (Sylvester's Criterion).
3. Determine whether $q$ is positive definite, positive semidefinite, negative definite, or indefinite.

#### Problem 3.2 (Parametric Positive Definiteness)
Consider the matrix with parameter $k \in \mathbb{R}$:
$$M_k = \begin{pmatrix} 1 & 2 & 0 \\ 2 & k & 1 \\ 0 & 1 & 3 \end{pmatrix}$$
1. Compute the leading principal minors $\Delta_1, \Delta_2, \Delta_3$.
2. Determine all values of $k$ for which $M_k$ is strictly positive definite.
3. Find values of $k$ for which the quadratic form $x^T M_k x$ is indefinite.
