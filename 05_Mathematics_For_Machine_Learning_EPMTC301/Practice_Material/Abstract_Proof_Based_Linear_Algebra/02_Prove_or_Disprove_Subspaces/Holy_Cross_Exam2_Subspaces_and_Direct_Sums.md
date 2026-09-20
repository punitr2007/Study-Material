# Holy Cross College — Linear Algebra Exam 2
## Topic: Vector Spaces, Subspaces, Polynomial Sets & Direct Sums

**Instructor Reference:** Prof. N. Fernandes (Department of Mathematics and Computer Science)  
**Format:** Abstract proof-based questions without matrix computations.

---

### Question 1: Vector Space Verification for Polynomial Subsets (Set 1 Q1 Style)
Determine whether each of the following subsets $W$ of the vector space $P_n(\mathbb{R})$ of polynomials of degree $\le n$ is a subspace over $\mathbb{R}$. Give a rigorous proof or provide a specific counterexample.

1. $W_1 = \{ p(x) \in P_n(\mathbb{R}) \mid p(0) = 0 \}$
   * **Proof / Verdict:** Yes, it is a subspace. $0(x) = 0 \implies 0(0) = 0$. For $p, q \in W_1$ and $c \in \mathbb{R}$, $(cp + q)(0) = c \cdot p(0) + q(0) = 0 + 0 = 0$.
2. $W_2 = \{ p(x) \in P_n(\mathbb{R}) \mid p(0) = 1 \}$
   * **Proof / Verdict:** No. The zero polynomial $z(x) = 0$ satisfies $z(0) = 0 \neq 1$, so the additive identity $\mathbf{0} \notin W_2$.
3. $W_3 = \{ p(x) \in P_n(\mathbb{R}) \mid p'(1) = p(2) \}$
   * **Proof / Verdict:** Yes. Since differentiation and evaluation are linear, $(cp+q)'(1) = cp'(1) + q'(1) = cp(2) + q(2) = (cp+q)(2)$.
4. $W_4 = \{ p(x) \in P_2(\mathbb{R}) \mid p(x) \ge 0 \; \forall x \in \mathbb{R} \}$
   * **Proof / Verdict:** No. Closed under addition, but fails scalar multiplication by negative scalars (e.g. $p(x) = x^2 \in W_4$, but $(-1)p(x) = -x^2 \notin W_4$).

---

### Question 2: Subsets of Real vs Complex Vector Spaces
Consider the vector space $V = \mathbb{C}^n$.
1. Is $W = \mathbb{R}^n$ a subspace of $\mathbb{C}^n$ when considered as a vector space over $\mathbb{R}$?
   * **Verdict:** Yes, addition and real scalar multiplication keep components in $\mathbb{R}$.
2. Is $W = \mathbb{R}^n$ a subspace of $\mathbb{C}^n$ when considered as a vector space over $\mathbb{C}$?
   * **Verdict:** No. For $x = (1, 0, \dots, 0) \in \mathbb{R}^n$ and $c = i \in \mathbb{C}$, $cx = (i, 0, \dots, 0) \notin \mathbb{R}^n$.

---

### Question 3: Direct Sum Decomposition Proof
Let $V$ be the vector space of all functions $f: \mathbb{R} \to \mathbb{R}$. Let:
$$U = \{ f \in V \mid f(-x) = f(x) \quad (\text{even functions}) \}$$
$$W = \{ f \in V \mid f(-x) = -f(x) \quad (\text{odd functions}) \}$$
1. Prove that $U$ and $W$ are subspaces of $V$.
2. Prove that $U \cap W = \{ \mathbf{0} \}$.
3. Prove that $V = U \oplus W$ (every function can be uniquely decomposed as $f(x) = f_{\text{even}}(x) + f_{\text{odd}}(x)$).
